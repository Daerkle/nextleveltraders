import { CodeBlock, InlineCode } from "@/components/docs/code-block";
import { Card } from "@/components/ui/card";
import { DocPageHeader } from "@/components/docs/page-header";
import {
  TestContainer,
  TestSection,
  TestExample,
  TestGroup,
  TestNote,
} from "@/components/test";

const examples = {
  typescript: `interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

// Eine Funktion, die einen Benutzer verarbeitet
function processUser(user: User) {
  const { id, name, email } = user;
  console.log(\`Verarbeite Benutzer \${name}\`);
  return {
    processed: true,
    timestamp: new Date(),
  };
}`,
  javascript: `const API_KEY = "your-api-key";
const BASE_URL = "https://api.example.com";

// API-Request Funktion
async function fetchData(endpoint) {
  try {
    const response = await fetch(\`\${BASE_URL}/\${endpoint}\`, {
      headers: {
        Authorization: \`Bearer \${API_KEY}\`
      }
    });
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
  }
}`,
  json: `{
  "subscription": {
    "plan": "pro",
    "status": "active",
    "features": [
      "real-time-data",
      "advanced-analytics",
      "ai-assistant"
    ],
    "limits": {
      "requests_per_day": 1000,
      "concurrent_connections": 10
    }
  }
}`,
  bash: `#!/bin/bash
# Install dependencies
npm install

# Start development server
npm run dev

# Environment variables
export API_KEY="your-secret-key"
export NODE_ENV="development"`,
};

export default function CodeBlockTestPage() {
  return (
    <TestContainer
      title="Code Block Demo"
      description="Test und Demo der Code-Block-Komponenten"
      sidebar={
        <Card className="p-4">
          <h3 className="font-medium mb-2">Features</h3>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>✓ Syntax Highlighting</li>
            <li>✓ Zeilennummern</li>
            <li>✓ Copy-to-Clipboard</li>
            <li>✓ Dateinamen</li>
            <li>✓ Inline Code</li>
            <li>✓ Unterstützung für mehrere Sprachen</li>
          </ul>
        </Card>
      }
    >
      <DocPageHeader
        heading="Code Block Demo"
        text="Demonstration verschiedener Code-Block-Stile und Funktionen"
      />

      <TestGroup>
        <TestSection
          title="Syntax Highlighting"
          description="Die Code-Blöcke unterstützen verschiedene Programmiersprachen mit Syntax-Highlighting."
        >
          <TestNote>
            Inline-Code wie <InlineCode>npm install</InlineCode> oder{" "}
            <InlineCode>const example = true</InlineCode> wird ebenfalls unterstützt.
          </TestNote>

          <div className="space-y-8">
            <TestExample
              title="TypeScript"
              description="TypeScript-Code mit Interface und Funktionsdefinition"
            >
              <CodeBlock
                code={examples.typescript}
                language="typescript"
                fileName="user.ts"
              />
            </TestExample>

            <TestExample
              title="JavaScript"
              description="JavaScript-Code mit API-Aufruf und Error-Handling"
            >
              <CodeBlock
                code={examples.javascript}
                language="javascript"
                fileName="api.js"
              />
            </TestExample>

            <TestExample
              title="JSON"
              description="JSON-Konfiguration mit verschachtelten Objekten"
            >
              <CodeBlock
                code={examples.json}
                language="json"
                fileName="config.json"
              />
            </TestExample>

            <TestExample
              title="Bash"
              description="Shell-Skript mit Befehlen und Umgebungsvariablen"
            >
              <CodeBlock
                code={examples.bash}
                language="bash"
                fileName="setup.sh"
              />
            </TestExample>
          </div>
        </TestSection>

        <TestSection
          title="Varianten"
          description="Code-Blöcke können in verschiedenen Varianten dargestellt werden."
        >
          <div className="space-y-6">
            <TestExample title="Ohne Zeilennummern">
              <CodeBlock
                code="console.log('Hello, World!');"
                language="javascript"
                showLineNumbers={false}
              />
            </TestExample>

            <TestExample title="Ohne Dateiname">
              <CodeBlock
                code='const greeting = "Hallo";'
                language="typescript"
              />
            </TestExample>
          </div>
        </TestSection>
      </TestGroup>
    </TestContainer>
  );
}