import { describe, expect, it } from "vitest"
import { stripCodeFences } from "./gemini"

describe("stripCodeFences", () => {
  it("removes json code fences", () => {
    expect(stripCodeFences('```json\n{"a":1}\n```')).toBe('{"a":1}')
  })
  it("removes bare code fences", () => {
    expect(stripCodeFences('```\n{"a":1}\n```')).toBe('{"a":1}')
  })
  it("leaves plain json untouched", () => {
    expect(stripCodeFences('{"a":1}')).toBe('{"a":1}')
  })
})
