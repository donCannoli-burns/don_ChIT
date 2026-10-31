// ChIT Don Report observation helper: no network, no file writes, no command execution.
// Source-only until reviewed and enabled by all three independent preferences.
// Never replaces ChIT's existing character pane relay override.

string [string] chit_don_collect_cached()
{
  string [string] facts;
  facts["schema"] = "don-chit-probe-v1";
  facts["playerId"] = to_string(my_id());
  facts["day"] = today_to_string();
  facts["life"] = to_string(my_ascensions());
  facts["adventures"] = to_string(my_adventures());
  facts["liverUsed"] = to_string(my_inebriety());
  facts["stomachUsed"] = to_string(my_fullness());
  facts["spleenUsed"] = to_string(my_spleen_use());
  return facts;
}

void chit_don_capture_if_enabled()
{
  // Fail closed unless global KoLFix policy AND source AND local ChIT toggle agree.
  if(get_property("donReport_collectionEnabled") != "true")
    return;
  if(get_property("donReport_relayCaptureEnabled") != "true")
    return;
  if(get_property("donReport_source_chit") != "true")
    return;
  if(cvars["chit.disable"] == "true")
    return; // Honor the original ChIT relay override OFF switch.
  if(cvars["chit.don.capture.enabled"] != "true")
    return;

  // Volatile local snapshot; NO journal/file/relay mutation.
  string [string] facts = chit_don_collect_cached();
  if(cvars["chit.don.print.enabled"] == "true" &&
    get_property("donReport_printChanges") == "true")
  {
    print("ChIT Don Report cached read: player=" + facts["playerId"] +
      " day=" + facts["day"] + " life=" + facts["life"] +
      " adventures=" + facts["adventures"]);
  }
}
