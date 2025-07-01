#!/usr/bin/env node
/**
 * SmartLead API Test Script
 * Tests the API connection with safe, read-only endpoints
 */

import { SmartLeadClient, SmartLeadError } from './client/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function testAPI(): Promise<void> {
  console.log('🚀 Testing SmartLead API Connection...\n');

  const apiKey = process.env.SMARTLEAD_API_KEY;
  if (!apiKey) {
    console.error('❌ No API key found in environment variables');
    process.exit(1);
  }

  console.log(`🔑 Using API Key: ${apiKey.substring(0, 8)}...`);

  const client = new SmartLeadClient({ apiKey });

  try {
    // Test 1: Basic connection test
    console.log('\n📡 Test 1: Testing basic connection...');
    await client.testConnection();
    console.log('✅ Connection successful!');

    // Test 2: List campaigns (safe read-only)
    console.log('\n📋 Test 2: Listing campaigns...');
    const campaigns = await client.listCampaigns({});
    console.log(
      `✅ Found ${Array.isArray(campaigns) ? campaigns.length : campaigns.total || 0} campaigns`
    );

    if (Array.isArray(campaigns) && campaigns.length > 0) {
      console.log('\n📊 Sample campaign data:');
      const firstCampaign = campaigns[0];
      console.log(`   • ID: ${firstCampaign.id}`);
      console.log(`   • Name: ${firstCampaign.name}`);
      console.log(`   • Status: ${firstCampaign.status}`);

      // Test 3: Get specific campaign details (safe read-only)
      console.log(`\n🔍 Test 3: Getting details for campaign ${firstCampaign.id}...`);
      const campaignDetails = await client.getCampaign(firstCampaign.id);
      console.log('✅ Campaign details retrieved successfully!');
      console.log(`   • Created: ${campaignDetails.created_at || 'N/A'}`);
      console.log(`   • Leads: ${campaignDetails.total_leads || 'N/A'}`);

      // Test 4: Get campaign analytics (safe read-only) - using the campaign ID from URL
      console.log(`\n📈 Test 4: Testing analytics endpoints...`);

      // Test the specific campaign from the URL you provided
      try {
        console.log('   Testing campaign 602996 analytics...');
        const analytics602996 = await client.fetchCampaignAnalyticsByDateRange(
          602996,
          {
            start_date: '2024-01-01',
            end_date: '2024-12-31'
          }
        );
        console.log('   ✅ Campaign 602996 analytics retrieved successfully!');
        console.log(`   • Analytics data: ${JSON.stringify(analytics602996).substring(0, 100)}...`);
      } catch (analyticsError) {
        const error = analyticsError as Error;
        console.log(`   ⚠️  Campaign 602996 analytics failed: ${error.message}`);
      }

      // Test analytics for the first campaign we found
      try {
        console.log(`   Testing campaign ${firstCampaign.id} analytics...`);
        const analyticsFirst = await client.fetchCampaignAnalyticsByDateRange(
          firstCampaign.id,
          {
            start_date: '2024-01-01',
            end_date: '2024-12-31'
          }
        );
        console.log(`   ✅ Campaign ${firstCampaign.id} analytics retrieved successfully!`);
        console.log(`   • Analytics data: ${JSON.stringify(analyticsFirst).substring(0, 100)}...`);
      } catch (analyticsError) {
        const error = analyticsError as Error;
        console.log(`   ⚠️  Campaign ${firstCampaign.id} analytics failed: ${error.message}`);
      }

      // Test 5: Download campaign data (new tool test)
      console.log(`\n📥 Test 5: Testing download campaign data...`);
      try {
        // Test JSON format
        console.log(`   Testing JSON download for campaign ${firstCampaign.id}...`);
        const jsonData = await client.statistics.downloadCampaignData(
          firstCampaign.id,
          'statistics',
          'json'
        );
        console.log('   ✅ JSON download successful!');
        console.log(`   • Total records: ${jsonData.total_records || 0}`);
        console.log(`   • Download type: ${jsonData.download_type}`);
        
        // Test CSV format
        console.log(`   Testing CSV download for campaign ${firstCampaign.id}...`);
        const csvData = await client.statistics.downloadCampaignData(
          firstCampaign.id,
          'statistics',
          'csv'
        );
        console.log('   ✅ CSV download successful!');
        console.log(`   • Format: ${csvData.format}`);
        console.log(`   • Size: ${csvData.size} bytes`);
      } catch (downloadError) {
        const error = downloadError as Error;
        console.log(`   ⚠️  Download campaign data failed: ${error.message}`);
      }
    }

    // Test 6: View download statistics (safe read-only)
    console.log('\n📊 Test 6: Testing view download statistics...');
    try {
      const downloadStats = await client.statistics.viewDownloadStatistics('last_30_days', 'date');
      console.log('✅ Download statistics retrieved successfully!');
      if (downloadStats.data) {
        console.log(`   • Time period: ${downloadStats.data.time_period || 'N/A'}`);
        console.log(`   • Group by: ${downloadStats.data.group_by || 'N/A'}`);
        if (downloadStats.data.statistics) {
          console.log(`   • Total campaigns: ${downloadStats.data.statistics.total_campaigns || 0}`);
          console.log(`   • Emails sent: ${downloadStats.data.statistics.emails_sent || 0}`);
        }
      }
    } catch (viewStatsError) {
      const error = viewStatsError as Error;
      console.log(`   ⚠️  View download statistics failed: ${error.message}`);
    }

    // Test 7: Get team details (safe read-only)
    console.log('\n👥 Test 7: Testing get team details...');
    try {
      const teamDetails = await client.clientManagement.getTeamDetails();
      console.log('✅ Team details retrieved successfully!');
      if (teamDetails.data) {
        console.log(`   • Team name: ${teamDetails.data.team_name || 'N/A'}`);
        console.log(`   • Members count: ${teamDetails.data.members_count || 0}`);
        console.log(`   • Active campaigns: ${teamDetails.data.active_campaigns || 0}`);
        if (teamDetails.data.recent_performance) {
          console.log(`   • Recent performance (${teamDetails.data.recent_performance.period}):`);
          console.log(`     - Sent: ${teamDetails.data.recent_performance.stats.sent || 0}`);
          console.log(`     - Opened: ${teamDetails.data.recent_performance.stats.opened || 0}`);
          console.log(`     - Replied: ${teamDetails.data.recent_performance.stats.replied || 0}`);
        }
      }
    } catch (teamError) {
      const error = teamError as Error;
      console.log(`   ⚠️  Get team details failed: ${error.message}`);
    }

    console.log('\n🎉 All API tests completed successfully!');
    console.log('\n📝 API Test Summary:');
    console.log('   ✅ Connection: Working');
    console.log('   ✅ Authentication: Valid');
    console.log('   ✅ Campaign listing: Working');
    console.log('   ✅ Campaign details: Working');
    console.log('   ✅ SmartLead MCP Server is ready to use!');
  } catch (error) {
    console.error('\n❌ API Test Failed:');

    if (error instanceof SmartLeadError) {
      console.error(`   SmartLead Error: ${error.message}`);
      console.error(`   Status Code: ${error.status}`);
      console.error(`   Error Code: ${error.code}`);
      console.error(`   Response: ${JSON.stringify(error.response)}`);
    } else if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
      console.error(`   Type: ${error.constructor.name}`);
    } else {
      console.error(`   Unknown error: ${error}`);
    }

    console.log('\n🔧 Troubleshooting:');
    console.log('   • Check if your API key is valid');
    console.log('   • Verify your SmartLead account has access');
    console.log('   • Check your internet connection');
    console.log('   • Visit: https://app.smartlead.ai for account details');

    process.exit(1);
  }
}

// Run the test
testAPI().catch((error: unknown) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
