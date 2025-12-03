import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "pocketdc-mcp",
  version: "0.1.0",
  description: "Mock FinOps/Cost Checker MCP [29, 30, 31, 32, 33]",
});

// Define tool "get_estimated_cost"
server.tool(
  "get_estimated_cost",
  "Returns the mock estimated cost for a service.",
  {
    service_name: z.string().describe("The name of the service to deploy."),
  },
  async (params) => {
    console.log(` MOCK COSTING: ${params.service_name}`);
    // Logic giả lập: Cố tình trả về $80 để kích hoạt cảnh báo (vượt spec $50)
    const mockCost = 80.00; 

    return {
      content: [{ 
        type: "text", 
        text: `Mock estimated cost for ${params.service_name} is $${mockCost}/month.` 
      }],
      json: {
        service: params.service_name,
        estimated_cost_usd: mockCost
      }
    };
  }
);

server.connect(new StdioServerTransport());
console.log(" Mock MCP Server is running.");