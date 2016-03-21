var CONFIG  = require("./config"),
    http = require("https"),
    headers = {
		'User-Agent': 'travis-ci-dashboard',
		'Authorization': 'token ' + CONFIG.GITHUB_TOKEN
	},
	username = process.argv[2],
	reposWithTesting = []

getRepos (function (allRepos) {
	var travis_counter = 0
	allRepos.forEach (function (repo) {
		getTravisStatus (username, repo.name, function (badgeSVG) {
			if (badgeSVG.length > 0) {
				var badge;

				if      (badgeSVG.indexOf("passing") >= 0)  { badge = "passing" }
				else if (badgeSVG.indexOf ("failing"))      { badge = "failing" }
				else                                        { badge = "unknown" }

				reposWithTesting.push ({
					'name': repo.name,
					'owner': repo.full_name.split("/")[0],
					'badge': badge,
					'badgeSVG': badgeSVG,
				})
			}

			if (++travis_counter == allRepos.length) {
				var buffered_out = "",
				    lastRunDate = new Date()

				buffered_out += "<html>";
				buffered_out += "<head>";
				buffered_out += "<title>Travis CI - Dashbard</title>";
				buffered_out += "<link rel='stylesheet' type='text/css' href='styles.css'>";
				buffered_out += "</head>";
				buffered_out += "<body>";
				buffered_out += "<div class='spinner'><div class='rect1'></div><div class='rect2'></div><div class='rect3'></div><div class='rect4'></div><div class='rect5'></div></div>";
				buffered_out += "<script src='https://code.jquery.com/jquery-1.12.2.min.js'></script>";
				buffered_out += "<script>var lastRunDate = '" + lastRunDate + "'; var repos = " + JSON.stringify (reposWithTesting) + ";</script>";
				buffered_out += "<script src='functionality.js'></script>";
				buffered_out += "</body>";
				buffered_out += "</html>";

				console.log (buffered_out);
			}
		})
	})
})

function getTravisStatus (username, rolename, callback) {
	var per_page = 100,
	    options = {
	      host: 'api.travis-ci.org',
	      port: 443,
	      path: "/" + username + "/" + rolename + ".svg",
	      method: 'GET'
	    }
	    req = http.request(options, function(res) {
			var buffered_out = ''

			res.setEncoding('utf8')
			res.on('data', function (chunk) {
				buffered_out += chunk
			})
			res.on('end', function () {
				try {					// if json response means error
					JSON.parse (buffered_out)
					callback ('')
				} catch (exception) {	// error parsing JSON means SVG recieved (which is the badge we want)
					callback (buffered_out)
				}
			})
		})

	req.on('error', function(error) {
		console.log('problem with request: ' + error.message);
	})

	req.write('{}')
	req.end()	
}

function getRepos (callback) {
	var repos = [];

	getPages (1, repos, function (data) {
		callback (data);
	});
}

function getPages (pagenumber, repos, callback) {
	var per_page = 100,
	    options = {
	      host: 'api.github.com',
	      port: 443,
	      path: "/orgs/" + username + "/repos?per_page=" + per_page + "&page=" + pagenumber,
	      method: 'GET',
	      headers: headers
	    }
	    req = http.request(options, function(res) {
			var buffered_out = ''

			res.setEncoding('utf8')
			res.on('data', function (chunk) {
				buffered_out += chunk
			})
			res.on('end', function () {
				var json = JSON.parse (buffered_out)

				json.forEach (function (item) {
					repos.push (item)
				})

				if (per_page == json.length) {
					getPages (++pagenumber, repos, callback)
				} else {
					callback (repos)
				}
			})
		})

	req.on('error', function(error) {
		console.log('problem with request: ' + error.message);
	})

	req.write('{}')
	req.end()
}
