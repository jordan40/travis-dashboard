var buffered_out = "";

buffered_out += "<div class='lastRun'><b>Last Run:</b> " + lastRunDate + "</div>"

// Stats
var stats = new Array ()

stats['passing'] = 0;
stats['failing'] = 0;
stats['unknown'] = 0;

repos.forEach (function (repo) {
  var badge = $(repo.badgeSVG).find("text").last().html();
  stats[badge]++;
})

buffered_out += "<div class='stats'>Passing / Failing / Unknown : <span class='passing'>" + stats['passing'] + "</span>/<span class='failing'>" + stats['failing'] + "</span>/<span class='unknown'>" + stats['unknown'] + "</span></div>";
// --- END Stats

// Organize
var buckets = new Array ();
buckets['other'] = new Array ();
buckets['other']['stats'] = new Array ();
buckets['other']['stats']['passing'] = 0;
buckets['other']['stats']['failing'] = 0;
buckets['other']['stats']['unknown'] = 0;
repos.forEach (function (repo) {
	var badge = $(repo.badgeSVG).find("text").last().html();

	if (repo.name.indexOf ("-") > 0) {
		var bucketName = repo.name.split ("-")[0];

		if (buckets[bucketName] === undefined) {
			buckets[bucketName] = new Array ();

			buckets[bucketName]['stats'] = new Array ();
			buckets[bucketName]['stats']['passing'] = 0;
			buckets[bucketName]['stats']['failing'] = 0;
			buckets[bucketName]['stats']['unknown'] = 0;
		}

		buckets[bucketName].push (repo);
		buckets[bucketName]['stats'][badge]++;
	} else {
		buckets['other'].push (repo);
		buckets['other']['stats'][badge]++;
	}
});

// any individual items in groups move them to 'other'
for (var bucketName in buckets) {
	var bucket = buckets[bucketName];

	if (bucket.length == 1) {
		var badge = $(bucket[0].badgeSVG).find("text").last().html();

		buckets['other'].push (bucket[0]);
		buckets['other']['stats'][badge]++;

		delete buckets[bucketName];
	}	
}

for (var bucketName in buckets) {
	buffered_out += "<fieldset><legend>" + bucketName + " (<span class='passing'>" + buckets[bucketName]['stats']['passing'] + "</span>/<span class='failing'>" + buckets[bucketName]['stats']['failing'] + "</span>/<span class='unknown'>" + buckets[bucketName]['stats']['unknown'] + "</span>)</legend><table>";
	buffered_out += "<tr><th>Repo</th><th>Tests</th><th>Issues</th><th>PRs</th><th>Code Climate</th></tr>"
	buckets[bucketName].forEach (function (repo) {
		buffered_out += "<tr><th><a href='https://github.com/"+ repo.owner + "/" + repo.name + "'>" + repo.name + "</a></th><td><a href='https://travis-ci.org/"+ repo.owner + "/" + repo.name + "'>" + repo.badgeSVG + "</a></td><td><a href='https://github.com/"+ repo.owner + "/" + repo.name + "/issues'>" + repo.issuesCount + "</a></td><td><a href='https://github.com/"+ repo.owner + "/" + repo.name + "/pulls'>" + repo.pullRequestCount + "</a></td><td><a href='https://codeclimate.com/github/"+ repo.owner + "/" + repo.name + "'><img src='https://codeclimate.com/github/"+ repo.owner + "/" + repo.name + "/badges/gpa.svg' /></a></td></tr>";
	});
	buffered_out += "</table></fieldset>";
}

// ---END Organize

// Write all output
$('.spinner').remove();
document.write (buffered_out);
