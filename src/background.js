function getSeps() {
  const sep = localStorage["option_separator"];
  const sep_char = localStorage["option_separator_str"];
  if (sep == null) return " : ";
  if (sep == "tab") return "\t";
  if (sep == "cr") return "\n";
  if (sep_char == null) return " : ";
  return " " + sep_char + " ";
}

async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
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

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab) return;
  const title = tab.title || "";
  const url   = tab.url   || "";
  const sep   = getSeps();

  const text = {
    copytitle:          title,
    copyurl:            url,
    copytitleurl:       title ? title + sep + url : url,
    copytitleurlwithGt: title ? "> " + title + sep + "> " + url : "> " + url,
    copyurlAsMarkdown:  title ? "[" + title + "](" + url + ")" : url,
    copyurlwtag:        '<a href="' + escapeHtml(url) + '">' + escapeHtml(title || url) + "</a>",
  }[info.menuItemId];

  if (text) copyToClipboard(text);
});
