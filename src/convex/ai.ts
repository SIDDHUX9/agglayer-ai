"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

// Simulate AI prediction action with enhanced market data
export const predictYield = action({
  args: {},
  handler: async (ctx): Promise<any> => {
    try {
      // Fetch current strategies and vaults for real-time data
      const strategies: any[] = await ctx.runQuery(internal.vaults.getStrategiesInternal);
      const vaults: any[] = await ctx.runQuery(internal.vaults.getVaultsInternal);

      // Build dynamic market data from database
      const marketData: string = strategies.map((s: { name: string; chain: string; currentApy: number; riskScore: number; tvl: number }) =>
        `- ${s.name} (${s.chain}): ${s.currentApy}% APY, Risk Score: ${s.riskScore}/10, TVL: $${s.tvl.toLocaleString()}`
      ).join('\n');

      const currentVault: any = vaults[0];
      const currentAllocation: Record<string, number> = currentVault ? JSON.parse(currentVault.allocations) : {};

      const openaiKey: string | undefined = process.env.OPENAI_API_KEY;
      if (openaiKey) {
        const prompt: string = `
          You are an elite DeFi Yield Optimizer AI with expertise in cross-chain asset allocation.
          
          Current Market Data:
  ${marketData}
          
          Current Portfolio Allocation:
  ${Object.entries(currentAllocation).map(([name, pct]) => `- ${name}: ${pct}%`).join('\n')}
          
          Task: Analyze the current market conditions and predict the optimal portfolio allocation for the next 24 hours to maximize risk-adjusted yield.
          
          Return ONLY a JSON object with this exact structure:
          {
            "predictedApy": number,
            "confidence": number,
            "allocation": {
              "Aave V3 (Polygon)": number,
              "QuickSwap (zkEVM)": number,
              "Beefy (CDK)": number
            },
            "reasoning": "brief explanation"
          }
        `;

        const res: Response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
          }),
        });

        if (res.ok) {
          const data: any = await res.json();
          const content: string | undefined = data.choices?.[0]?.message?.content;
          if (content) {
            const jsonStr: string = content.replace(/```json/g, '').replace(/```/g, '');
            return JSON.parse(jsonStr);
          }
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