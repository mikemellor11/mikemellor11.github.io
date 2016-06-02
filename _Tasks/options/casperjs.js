module.exports = {
	options: {
        casperjsOptions: [
            '--url=<%= String.format(contentJson.attributes.local.url, getIP(), ("~" + process.env.USER)) %>',
            '--contentJson=' + '<%= JSON.stringify(contentJson) %>'
        ]
    },
    dist: {
        options: {
            casperjsOptions: [
                '--url=' + '<%= contentJson.attributes.internal.url %>',
                '--contentJson=' + '<%= JSON.stringify(contentJson) %>'
            ]
        },
        src: ['_Test/casperjs/*.js']
    },
    local: {
        src: ['_Test/casperjs/*.js']
    }
}