import { describe, expect, it } from "vitest";
import { extractURLsFromComponent } from "./react";

describe("extractURLsFromComponent", () => {
  it("should return an empty array when there are no URLs", () => {
    const component = <div>No URLs here!</div>;
    const result = extractURLsFromComponent(component);
    expect(result).toEqual([]);
  });

  it("should extract URLs from <a> tags", () => {
    const component = (
      <div>
        <a href="https://example.com">Example</a>
        <a href="https://another.com">Another</a>
      </div>
    );
    const result = extractURLsFromComponent(component);
    expect(result).toEqual(["https://example.com", "https://another.com"]);
  });

  it("should extract URLs from <img> tags", () => {
    const component = (
      <div>
        <img src="https://example.com/image1.png" alt="Example 1" />
        <img src="https://another.com/image2.png" alt="Example 2" />
      </div>
    );
    const result = extractURLsFromComponent(component);
    expect(result).toEqual(["https://example.com/image1.png", "https://another.com/image2.png"]);
  });

  it("should extract URLs from both <a> and <img> tags", () => {
    const component = (
      <div>
        <a href="https://example.com">Example</a>
        <img src="https://example.com/image1.png" alt="Example 1" />
      </div>
    );
    const result = extractURLsFromComponent(component);
    expect(result).toEqual(["https://example.com", "https://example.com/image1.png"]);
  });

  it("should extract URLs from nested elements", () => {
    const component = (
      <div>
        <div>
          <a href="https://example.com">Example</a>
          <div>
            <img src="https://example.com/image1.png" alt="Example 1" />
          </div>
        </div>
      </div>
    );
    const result = extractURLsFromComponent(component);
    expect(result).toEqual(["https://example.com", "https://example.com/image1.png"]);
  });

  it("should handle components with no children", () => {
    const component = <div />;
    const result = extractURLsFromComponent(component);
    expect(result).toEqual([]);
  });
});
