var buffered_out = "";

// Stats
var stats = new Array ()

stats['passing'] = 0;
stats['failing'] = 0;
stats['unknown'] = 0;

repos.forEach (function (repo) {
  var badge = $(repo.badgeSVG).find("text").last().html();
  stats[badge]++;
})

buffered_out += "Passing: " + stats['passing'] + "<br />";
buffered_out += "Failing: " + stats['failing'] + "<br />";
buffered_out += "Unknown: " + stats['unknown'] + "<br />";
buffered_out += "         -----" + "<br />";
buffered_out += "  Total: " + (stats['unknown'] + stats['failing'] + stats['passing']) + "<br />";
// --- END Stats

// Organize
var buckets = new Array ();
buckets['other'] = new Array ();
repos.forEach (function (repo) {
	if (repo.name.indexOf ("-") > 0) {
		var bucketName = repo.name.split ("-")[0];

		if (buckets[bucketName] === undefined) {
			buckets[bucketName] = new Array ();
		}

		buckets[bucketName].push (repo);
	} else {
		buckets['other'].push (repo);
	}
});

for (var bucketName in buckets) {
	var bucket = buckets[bucketName];

	if (bucket.length == 1) {
		buckets['other'].push (bucket[0]);
		delete buckets[bucketName];
	}	
}

for (var bucketName in buckets) {
	buffered_out += "<fieldset><legend>" + bucketName + "</legend><table>";
	buckets[bucketName].forEach (function (repo) {
		buffered_out += "<tr><th>" + repo.name + "</th><td>" + repo.badgeSVG + "</td></tr>";
	});
	buffered_out += "</table></fieldset>";
}

// ---END Organize

// Write all output
document.write (buffered_out);
