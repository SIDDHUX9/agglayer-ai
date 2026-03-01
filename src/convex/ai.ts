"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { vly } from "../lib/vly-integrations";

// Simulate AI prediction action with enhanced market data
export const predictYield = action({
  args: {},
  handler: async (ctx) => {
    try {
      // Fetch current strategies and vaults for real-time data
      const strategies = await ctx.runQuery(internal.vaults.getStrategiesInternal);
      const vaults = await ctx.runQuery(internal.vaults.getVaultsInternal);

      // Build dynamic market data from database
      const marketData = strategies.map((s: { name: string; chain: string; currentApy: number; riskScore: number; tvl: number }) =>
        `- ${s.name} (${s.chain}): ${s.currentApy}% APY, Risk Score: ${s.riskScore}/10, TVL: $${s.tvl.toLocaleString()}`
      ).join('\n');

      const currentVault = vaults[0];
      const currentAllocation = currentVault ? JSON.parse(currentVault.allocations) : {};

      const prompt = `
        You are an elite DeFi Yield Optimizer AI with expertise in cross-chain asset allocation.
        
        Current Market Data:
${marketData}
        
        Current Portfolio Allocation:
${Object.entries(currentAllocation).map(([name, pct]) => `- ${name}: ${pct}%`).join('\n')}
        
        Task: Analyze the current market conditions and predict the optimal portfolio allocation for the next 24 hours to maximize risk-adjusted yield.
        
        Consider:
        1. APY vs Risk Score trade-offs
        2. Diversification across chains (Polygon PoS, zkEVM, CDK)
        3. TVL concentration risk
        4. Gas costs for rebalancing
        
        Return ONLY a JSON object with this exact structure (no markdown, no explanatory text):
        {
          "predictedApy": number (expected weighted average APY),
          "confidence": number (0.0 to 1.0, based on market volatility),
          "allocation": {
            "Aave V3 (Polygon)": number,
            "QuickSwap (zkEVM)": number,
            "Beefy (CDK)": number
          },
          "reasoning": "brief explanation of the allocation strategy"
        }
        
        Ensure allocations sum to exactly 100.
      `;

      const result = await vly.ai.completion({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        maxTokens: 600,
        temperature: 0.7,
      });

      if (result.success && result.data) {
        const content = result.data.choices[0]?.message?.content;
        if (content) {
          // Clean up markdown if present
          const jsonStr = content.replace(/```json/g, '').replace(/```/g, '');
          const prediction = JSON.parse(jsonStr);

          return prediction;
        }
      }

      // Fallback to default prediction
      return {
        timestamp: Date.now(),
        predictedApy: 15.8,
        confidence: 0.92,
        allocation: {
          "Aave V3 (Polygon)": 25,
          "QuickSwap (zkEVM)": 45,
          "Beefy (CDK)": 30
        }
      };
    } catch (error) {
      console.error("AI prediction error:", error);
      return {
        timestamp: Date.now(),
        predictedApy: 15.8,
        confidence: 0.92,
        allocation: {
          "Aave V3 (Polygon)": 25,
          "QuickSwap (zkEVM)": 45,
          "Beefy (CDK)": 30
        }
      };
    }
  },
});