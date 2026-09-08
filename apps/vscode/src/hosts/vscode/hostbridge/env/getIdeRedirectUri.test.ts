import { describe, expect, mock, test } from "bun:test"

const env = { uiKind: 1, uriScheme: "vscode" }
mock.module("vscode", () => ({ env, UIKind: { Web: 2 } }))
mock.module("@/registry", () => ({ ExtensionRegistryInfo: { id: "tfastdigital.tfast-dev-ai" } }))
const { getIdeRedirectUri } = await import("./getIdeRedirectUri")

describe("getIdeRedirectUri", () => {
	test("routes desktop callbacks to the running fork", async () => {
		expect((await getIdeRedirectUri({})).value).toBe("vscode://tfastdigital.tfast-dev-ai")
	})
	test("preserves alternative desktop URI schemes", async () => {
		env.uriScheme = "vscode-insiders"
		try {
			expect((await getIdeRedirectUri({})).value).toBe("vscode-insiders://tfastdigital.tfast-dev-ai")
		} finally {
			env.uriScheme = "vscode"
		}
	})
	test("keeps web callbacks in the browser", async () => {
		env.uiKind = 2
		try {
			expect((await getIdeRedirectUri({})).value).toBe("")
		} finally {
			env.uiKind = 1
		}
	})
})
