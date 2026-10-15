function copyToClipboard(str) {
	var obj=document.getElementById("hbnaclhngkhpmpgmfakaghgjbblokeeh");
	if (obj) {
	  obj.value = str;
	  obj.select();
	  if (document.execCommand("copy", false, null)) {
	    const status = document.getElementById("copy-status");
	    status.hidden = false;
	    setTimeout(() => window.close(), 500);
	  } else {
	    console.error("Copy failed");
	  }
	}
}

function getSeps() {
	var sep = localStorage["option_separator"];
	var sep_char = localStorage["option_separator_str"];

	if( sep == null ) return " : ";

	if( sep == "tab" ) return "\t";
	if( sep == "cr" ) return "\n";

	if( sep_char == null ) return " : ";

	return " " + sep_char + " ";
}

function copyTitle() {
	let queryOptions = {active: true, lastFocusedWindow: true};
	chrome.tabs.query(queryOptions, ([tab]) => {
		copyToClipboard( tab.title );
	});
}

function copyurl() {
	let queryOptions = {active: true, lastFocusedWindow: true};
	chrome.tabs.query(queryOptions, ([tab]) => {
	  copyToClipboard( tab.url );
	});
}

function copyurlAsMarkdown() {
	let queryOptions = {active: true, lastFocusedWindow: true};
	chrome.tabs.query(queryOptions, ([tab]) => {
	  if( tab.title ){
	    copyToClipboard('['+tab.title+']'+'('+tab.url+')');
	  } else {
	    copyToClipboard( tab.url );
	  }
	});
}

function copytitleurl() {
	let queryOptions = {active: true, lastFocusedWindow: true};
	chrome.tabs.query(queryOptions, ([tab]) => {
	  if( tab.title ){
	    copyToClipboard( tab.title + getSeps() + tab.url );
	  } else {
	    copyToClipboard( tab.url );
	  }
	});
}

function copytitleurlWithGt() {
	let queryOptions = {active: true, lastFocusedWindow: true};
	chrome.tabs.query(queryOptions, ([tab]) => {
		if( tab.title ){
			copyToClipboard( "> " + tab.title + getSeps() + "> " + tab.url );
		} else {
			copyToClipboard( "> " + tab.url );
		}
	});
}

function copyurlwtag() {
	let queryOptions = {active: true, lastFocusedWindow: true};
	chrome.tabs.query(queryOptions, ([tab]) => {
	  if( tab.title ){
	    copyToClipboard( "<a href=\"" + tab.url + "\">" + tab.title + "</a>" );
	  } else {
	    copyToClipboard( "<a href=\"" + tab.url + "\">" + tab.url + "</a>" );
	  }
	});
}

document.addEventListener('DOMContentLoaded', function () {
	  document.getElementById('copytitle').addEventListener('click', copyTitle);
	  document.getElementById('copyurl').addEventListener('click', copyurl);
	  document.getElementById('copyurlAsMarkdown').addEventListener('click', copyurlAsMarkdown);
	  document.getElementById('copytitleurl').addEventListener('click', copytitleurl);
	  document.getElementById('copytitleurlwithGt').addEventListener('click', copytitleurlWithGt);
	  document.getElementById('copyurlwtag').addEventListener('click', copyurlwtag);
})
