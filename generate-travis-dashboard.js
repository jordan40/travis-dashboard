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
		getGithubIssues (username, repo.name, function (github_issues) {
			getGithubPullRequests (username, repo.name, function (github_pullrequests) {
				getTravisToken(CONFIG.GITHUB_TOKEN, function(travisToken) {
					getTravisStatus (username, repo.name, travisToken, function (badgeSVG) {
//					if (badgeSVG.length > 0) {
						var badge;

						if      (badgeSVG.indexOf("passing") >= 0)  { badge = "passing" }
						else if (badgeSVG.indexOf ("failing"))      { badge = "failing" }
						else                                        { badge = "unknown" }

						reposWithTesting.push ({
							'name': repo.name,
							'owner': repo.full_name.split("/")[0],
							'badge': badge,
							'badgeSVG': badgeSVG,
							'issuesCount': JSON.parse(github_issues).length,
							'pullRequestCount': JSON.parse(github_pullrequests).length
						})
//					}

					if (++travis_counter == allRepos.length) {
						var lastRunDate = new Date()

						console.log ("var lastRunDate = '" + lastRunDate + "';var repos = " + JSON.stringify (reposWithTesting) + ";")
						console.log ("var githubHost = '" + CONFIG.GITHUB_API_HOST + "';")
						console.log ("var travisHost = '" + CONFIG.TRAVIS_API_HOST + "';")
					}
					})
				})
			})
		})
	})
})

function getGithubPullRequests (owner, repo, callback) {
	var per_page = 100,
	    options = {
	      host: CONFIG.GITHUB_API_HOST,
	      port: 443,
	      path: "/api/v3/repos/" + owner + "/" + repo + "/pulls",
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
				callback (buffered_out)
			})
		})

	req.on('error', function(error) {
		console.log('problem with request: ' + error.message);
	})

	req.write('{}')
	req.end()	
}

function getGithubIssues (owner, repo, callback) {
	var per_page = 100,
	    options = {
	      host: CONFIG.GITHUB_API_HOST,
	      port: 443,
	      path: "/api/v3/repos/" + owner + "/" + repo + "/issues",
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
				callback (buffered_out)
			})
		})

	req.on('error', function(error) {
		console.log('problem with request: ' + error.message);
	})

	req.write('{}')
	req.end()	
}

function getTravisToken (githubToken, callback) {
	options = {
			host: CONFIG.TRAVIS_API_HOST,
			port: 443,
			path: "/api/auth/github",
			method: 'POST',
			headers: {
				'User-Agent': 'travis-ci-dashboard',
				'Content-Type': 'application/json'
			}
	}
	req = http.request(options, function(res) {
		var buffered_out = ''
			
			res.setEncoding('utf8')
			res.on('data', function (chunk) {
				buffered_out += chunk
			})
			res.on('end', function () {
				callback(JSON.parse (buffered_out).access_token)
			})
	})
	
	req.on('error', function(error) {
		console.log('problem with request: ' + error.message);
	})
	
	req.write('{"github_token":"' + githubToken + '"}')
	req.end()	
}

function getTravisStatus (username, rolename, travisToken, callback) {
	var per_page = 100,
	    options = {
	      host: CONFIG.TRAVIS_API_HOST,
	      port: 443,
	      path: "/api/" + username + "/" + rolename + ".svg",
	      method: 'GET',
    	  headers: {
    			'User-Agent': 'travis-ci-dashboard',
    			'Authorization': 'token ' + travisToken
    		}
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
	      host: CONFIG.GITHUB_API_HOST,
	      port: 443,
	      path: "/api/v3/orgs/" + username + "/repos?per_page=" + per_page + "&page=" + pagenumber,
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
