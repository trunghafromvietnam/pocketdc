# PocketDC – Shift-Left FinOps Inside Your IDE

> **Tagline:** Shift-Left FinOps: Catch Cloud Costs Before You Deploy.

PocketDC is a FinOps guardrail built on top of **Kiro + MCP**. 

Every time you save a service spec file, PocketDC automatically estimates the cloud cost and tells you whether your service is **OVER_BUDGET** or **WITHIN_BUDGET** – right inside your IDE.

Instead of discovering problems 30 days later on a cloud invoice, developers get instant feedback at development time.

---

## ✨ Features

- **Shift-Left FinOps**  
  Run cost checks at the moment of coding, not after deployment.

- **Automatic on Save**  
  Saving a `*.service.md` file in `.kiro/specs/` triggers a Kiro Hook that launches a full FinOps analysis.

- **MCP-Powered Cost Estimation**  
  Uses a custom MCP server (`pocketdc-mcp`) with a tool:
  ```ts
  get_estimated_cost(service_name: string)
  ```

- **Living Service Specs**  
  PocketDC rewrites a PocketDC Report block at the top of the spec file with:
  ```markdown
  # PocketDC Report:
  # estimated_cost: 80 USD/month
  # max_cost: 50 USD/month
  # status: OVER_BUDGET
  ```

- **Actionable Suggestions**  
  When the service is over budget, PocketDC suggests concrete optimization ideas (reduce instances, memory, CPU, etc.).

---

## 🏗 Architecture Overview

**Project layout:**

```
pocketdc-kiro/
├─ .kiro/
│  ├─ hooks/
│  │  └─ finops-cost-check.kiro.hook     # Kiro Hook for FinOps on save
│  └─ specs/
│     └─ pocketdc.service.md             # Sample service spec with max_cost
├─ pocketdc-mcp/
│  ├─ server.js                          # MCP server implementation
│  ├─ package.json
│  ├─ package-lock.json
│  └─ node_modules/                      # Local dependencies
└─ README.md
```

**Flow:**

1. Developer edits `.kiro/specs/pocketdc.service.md`
2. Developer presses **Save**
3. Hook `finops-cost-check.kiro.hook` triggers on `fileEdited` for `**/.kiro/specs/*.service.md`
4. Kiro Agent:
   - reads the spec
   - extracts `service_name` and `max_cost`
   - calls MCP tool `mcp_pocketdc_mcp_get_estimated_cost`
   - compares estimated cost vs max_cost
   - rewrites the **PocketDC Report** block in the spec
5. Developer immediately sees **OVER_BUDGET** or **WITHIN_BUDGET** plus suggestions.

---

## 🚀 Getting Started

⚠️ **Prerequisites:**
- Kiro installed
- Node.js (v18+ recommended)

### 1. Clone this repo

```bash
git clone <THIS-REPO-URL> pocketdc-kiro
cd pocketdc-kiro
```

### 2. Install MCP server dependencies

```bash
cd pocketdc-mcp
npm install
cd ..
```

### 3. Configure MCP in Kiro

Open Kiro's MCP settings and add the `pocketdc-mcp` server:

- **Command:** `node`
- **Args:** `["pocketdc-mcp/server.js"]` (adjust path if needed)
- **Disabled:** `false`

Or manually create `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "pocketdc-mcp": {
      "command": "node",
      "args": ["pocketdc-mcp/server.js"],
      "disabled": false
    }
  }
}
```

Kiro will start the MCP server automatically when needed.

### 4. Open the project in Kiro

- Open `pocketdc-kiro` as a workspace in Kiro.
- Ensure the **PocketDC FinOps Hook** is enabled in the Hooks panel.

---

## 🧪 Demo: How to Use PocketDC

1. Open `.kiro/specs/pocketdc.service.md` in Kiro:

```markdown
# PocketDC Service Specification

## Service Configuration

**service_name**: my-web-service

**max_cost**: 50 (USD/month)

## Resource Allocation

**cpu**: 1 core

**memory**: 512 MB

**autoscaling**:
- min_instances: 1
- max_instances: 3

## Description

This is a sample web service configuration for PocketDC FinOps guardrail testing.
```

2. Press **Save**.

3. PocketDC will:
   - trigger the hook,
   - call the MCP server,
   - estimate cost (e.g. 80 USD/month),
   - update the spec with a report block:

```markdown
# PocketDC Report:
# estimated_cost: 80 USD/month
# max_cost: 50 USD/month
# status: OVER_BUDGET
```

4. In Kiro Chat / Output, you'll see a FinOps warning and optimization suggestions.

---

## 🧠 Why This Matters

- Cloud cost overruns are often discovered **after deployment** and **after the bill arrives**.
- Existing FinOps tools are mostly **reactive** and live **outside the development flow**.
- PocketDC brings cost awareness **directly into the IDE**, at the exact moment developers define their services.
- This is **Shift-Left FinOps**: catching bad cost decisions early, when they are cheapest to fix.

---

## 🛠 Tech Stack

- **Kiro IDE** – chat, hooks, automation
- **Model Context Protocol (MCP)** – connecting Kiro to external tools
- **Node.js** – MCP server runtime
- **Zod** – schema validation for tool parameters
- **JavaScript (ES Modules)** – main implementation
- **YAML / Markdown** – service specs
- **JSON / JSONC** – configuration

---

## 🔮 What's Next

- Integrate with real **AWS/GCP/Azure pricing APIs**
- Add an `optimize` tool to automatically propose config diffs
- Support **organization-wide budgets** and team alerts
- Provide a visual **"cost heatmap"** of services inside the IDE

---

**PocketDC – Catch Cloud Costs Before You Deploy.**
