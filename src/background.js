// background.js

async function getSeps() {
  const { option_separator: sep, option_separator_str: sep_char } =
    await chrome.storage.local.get(["option_separator", "option_separator_str"]);
  if (sep == null)      return " : ";
  if (sep == "tab")     return "\t";
  if (sep == "cr")      return "\n";
  if (sep_char == null) return " : ";
  return " " + sep_char + " ";
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
}

chrome.runtime.onInstalled.addListener(() => {
  [
    { id: "copytitle",          title: "Title only" },
    { id: "copyurl",            title: "URL only" },
    { id: "copytitleurl",       title: "Title + URL" },
    { id: "copytitleurlwithGt", title: "> Title + URL" },
    { id: "copyurlAsMarkdown",  title: "Markdown Link" },
    { id: "copyurlwtag",        title: "<a href=> Tag" },
  ].forEach(item => {
    chrome.contextMenus.create({ id: item.id, title: item.title, contexts: ["all"] });
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;

  const title = tab.title || "";
  const url   = tab.url   || "";
  const sep   = await getSeps();

  const text = {
    copytitle:          title,
    copyurl:            url,
    copytitleurl:       title ? title + sep + url : url,
    copytitleurlwithGt: title ? "> " + title + sep + "> " + url : "> " + url,
    copyurlAsMarkdown:  title ? "[" + title + "](" + url + ")" : url,
    copyurlwtag:        '<a href="' + escapeHtml(url) + '">' + escapeHtml(title || url) + "</a>",
  }[info.menuItemId];

  if (!text) return;

  // clipboard API is unavailable in service workers
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async (text) => {
      await navigator.clipboard.writeText(text);
      const bubble = document.createElement("div");
      bubble.textContent = "Copied";
      bubble.style.cssText = "position:fixed;top:16px;right:16px;z-index:2147483647;padding:8px 12px;border-radius:6px;background:#333;color:#fff;font:14px sans-serif;pointer-events:none";
      document.documentElement.appendChild(bubble);
      setTimeout(() => bubble.remove(), 500);
    },
    args: [text],
  }).catch(error => console.error("Copy failed:", error));
});
