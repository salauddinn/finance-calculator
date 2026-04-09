import RootLayout from "@/app/layout";

describe("RootLayout", () => {
  it("wraps the app in the document shell", () => {
    const result = RootLayout({
      children: <div>Calculator content</div>
    });

    expect(result.type).toBe("html");
    expect(result.props.lang).toBe("en");
    expect(result.props.children.type).toBe("body");
    expect(result.props.children.props.className).toBe("app-body");
  });
});
