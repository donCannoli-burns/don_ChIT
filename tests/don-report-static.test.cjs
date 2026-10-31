"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const main = fs.readFileSync("src/relay/charpane.ash", "utf8");
const observer = fs.readFileSync("src/relay/chit_donReport.ash", "utf8");
let passed = 0;
function check(label,fn){fn();passed++;console.log("PASS:",label)}
check("existing charpane remains relay override",()=>{
 assert.match(main,/void main\(\)/);
 assert.match(main,/visit_url\(\)\.modifyPage\(\)\.write\(\)/);
});
check("new helper is included",()=>assert.ok(main.includes('import "chit_donReport.ash"')));
check("new toggles default off",()=>{
 for(const key of ["chit.don.capture.enabled","chit.don.print.enabled"])
  assert.ok(main.includes(`chit_setvar("${key}", false)`));
});
check("core capture depends on global, relay, source and ChIT gates",()=>{
 for(const key of ["donReport_collectionEnabled","donReport_relayCaptureEnabled","donReport_source_chit","chit.don.capture.enabled","chit.disable"])
  assert.ok(observer.includes(key),key);
});
check("no game mutation, network, Kmail, or file writes in helper",()=>{
 assert.doesNotMatch(observer,/\b(?:cli_execute|visit_url|set_property|adventure|adv1|buffer_to_file|map_to_file|append_buffer_to_file|buy|kmail)\s*\(/i);
});
check("raw relay page is never passed into capture",()=>{
 assert.ok(!observer.includes("form_fields("));
 assert.ok(!observer.includes("get_path_full("));
});
check("original ChIT disable switch preserved",()=>{
 assert.ok(main.includes('chit_setvar("chit.disable", false)'));
 assert.ok(main.includes('cvars["chit.disable"]'));
});
console.log(`ChIT Don Report static gates: ${passed} passed.`);
