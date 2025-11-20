// Force dynamic rendering
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

import { auth } from "@/lib/auth";
import { collections } from "@/lib/db";
import { ObjectId } from "mongodb";
import { unauthorizedResponse, forbiddenResponse, successResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";

/**
 * POST /api/influencer/instagram/verify-setup
 * Verifies Instagram Business Account setup
 * Returns setup status with detailed information
 */
export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      logger.error("Unauthorized: No session found");
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "influencer") {
      logger.error("Forbidden: User is not an influencer", { role: session.user.role });
      return forbiddenResponse("Influencer access required");
    }

    const userId = session.user.id;

    logger.info("Verifying Instagram setup", { userId });

    // Get the user's current access token from MongoDB (if they've connected before)
    const influencerProfilesCollection = await collections.influencerProfiles();
    const profile = await influencerProfilesCollection.findOne({ user_id: new ObjectId(userId) });

    let accessToken: string | null = null;

    // Check if user has an existing Instagram connection
    if (profile?.instagram_account?.access_token) {
      accessToken = profile.instagram_account.access_token;
      logger.info("Found existing access token");
    }

    // If no access token, user hasn't connected yet - return needs_connection
    if (!accessToken) {
      logger.info("No access token found - user needs to initiate OAuth");
      return successResponse({
        status: "needs_connection",
        message: "Please click 'Connect Instagram Account' to begin setup",
        step: null,
      });
    }

    // ============================================================================
    // STEP 1: Check Facebook Pages
    // ============================================================================
    logger.info("Checking Facebook pages...");

    const pagesUrl = new URL("https://graph.facebook.com/v20.0/me/accounts");
    pagesUrl.searchParams.set("access_token", accessToken);
    pagesUrl.searchParams.set("fields", "id,name,access_token,instagram_business_account");

    let pagesData: any;
    try {
      const pagesResponse = await fetch(pagesUrl.toString());
      pagesData = await pagesResponse.json();

      if (!pagesResponse.ok || pagesData.error) {
        logger.warn("Token may be expired or invalid", { error: pagesData.error });
        return successResponse({
          status: "token_expired",
          message: "Your Instagram connection has expired. Please reconnect.",
          step: null,
        });
      }
    } catch (error) {
      logger.error("Failed to fetch pages", error);
      return Response.json(
        {
          success: false,
          error: {
            message: "Failed to verify setup. Please try reconnecting.",
            code: "VERIFICATION_FAILED",
          },
        },
        { status: 500 }
      );
    }

    const pages = pagesData.data || [];
    logger.info("Facebook pages found", { pageCount: pages.length });

    // ============================================================================
    // STEP 2: Check for Pages
    // ============================================================================
    if (pages.length === 0) {
      logger.info("No Facebook pages found - need to create page");
      return successResponse({
        status: "no_pages",
        message: "You need a Facebook Page to connect your Instagram Business Account",
        step: "create_page",
        action_url: "https://www.facebook.com/pages/create",
      });
    }

    // ============================================================================
    // STEP 3: Check for Instagram Business Account Connection
    // ============================================================================
    const pageWithInstagram = pages.find((page: any) => page.instagram_business_account);

    if (!pageWithInstagram) {
      logger.info("No Instagram Business Account linked to any page");

      // Get the first page ID to help user link
      const firstPageId = pages[0].id;

      return successResponse({
        status: "not_linked",
        message: "Your Instagram account is not linked to any Facebook Page",
        step: "link_instagram",
        action_url: `https://www.facebook.com/${firstPageId}/settings/?tab=instagram`,
        page_id: firstPageId,
        page_name: pages[0].name,
      });
    }

    const instagramBusinessAccountId = pageWithInstagram.instagram_business_account.id;
    const pageId = pageWithInstagram.id;
    const pageAccessToken = pageWithInstagram.access_token;

    logger.info("Instagram Business Account found", { instagramBusinessAccountId, pageId });

    // ============================================================================
    // STEP 4: Check Account Type
    // ============================================================================
    logger.info("Checking account type...");

    const igAccountUrl = new URL(`https://graph.facebook.com/v20.0/${instagramBusinessAccountId}`);
    igAccountUrl.searchParams.set("fields", "id,username,account_type");
    igAccountUrl.searchParams.set("access_token", pageAccessToken);

    let igAccountData: any;
    try {
      const igAccountResponse = await fetch(igAccountUrl.toString());
      igAccountData = await igAccountResponse.json();

      if (!igAccountResponse.ok || igAccountData.error) {
        logger.error("Failed to fetch IG account type", { error: igAccountData.error });
        throw new Error("Failed to fetch account type");
      }
    } catch (error) {
      logger.error("Account type check failed", error);
      return Response.json(
        {
          success: false,
          error: {
            message: "Failed to verify account type",
            code: "ACCOUNT_TYPE_CHECK_FAILED",
          },
        },
        { status: 500 }
      );
    }

    logger.info("Account type fetched", { accountType: igAccountData.account_type });

    // Check if account is personal (MEDIA_CREATOR, BUSINESS are good; PERSONAL is not)
    if (igAccountData.account_type === "PERSONAL") {
      logger.info("Instagram account is personal - needs to be converted");
      return successResponse({
        status: "personal_account",
        message: "Your Instagram account is a Personal account. You need to convert it to a Creator or Business account.",
        step: "convert_to_business",
        action_url: "instagram://settings/account",
        username: igAccountData.username,
      });
    }

    // ============================================================================
    // STEP 5: Everything is ready!
    // ============================================================================
    logger.info("Setup verification complete - all good!");

    return successResponse({
      status: "ready",
      message: "Great! Your Instagram is ready. Click 'Connect Instagram Account' to complete the connection.",
      step: null,
      instagram_id: instagramBusinessAccountId,
      page_id: pageId,
      username: igAccountData.username,
      account_type: igAccountData.account_type,
    });

  } catch (error) {
    logger.error("Error in verify-setup", error);
    return Response.json(
      {
        success: false,
        error: {
          message: "Failed to verify Instagram setup",
          code: "VERIFICATION_ERROR",
        },
      },
      { status: 500 }
    );
  }
}
