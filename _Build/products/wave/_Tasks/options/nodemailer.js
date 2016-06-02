module.exports = {
	options: {
        transport: require('nodemailer').createTransport('smtps://fishawack.auto.package%40gmail.com:13Orange02@smtp.gmail.com').transporter,
        recipients: "<%= contentJson.attributes.autoEmail %>"
    },
    internal: {
        options: {
            message: {
                from: "fishawack.auto.package@gmail.com",
                subject: 'Auto-package:Internal: <%= pkg.name %> - <%= contentJson.attributes.title %>',
                html: '<body>\
                    <h2><%= pkg.name %></h2> \
                    <ul> \
                        <li><strong>Instance name</strong>: <%= contentJson.attributes.title %></li> \
                        <li><strong>Build version</strong>: <%= pkg.version %></li> \
                        <li><strong>Date built</strong>: <%= grunt.template.today("dd-mm-yy") %></li> \
                        <li><strong>Internal Url</strong>: <a href="<%= contentJson.attributes.internal.url %>"><%= contentJson.attributes.internal.url %></a></li> \
                        <li><strong>Google tracking id</strong>: <%= contentJson.attributes.googleTrackingID %></li> \
                    </ul> \
                    <h2>Git log</h2> \
                    <ul> \
                        <%= gitLogString %> \
                    </ul> \
                </body>'
            }
        }
    },
    external: {
        options: {
            message: {
                from: "fishawack.auto.package@gmail.com",
                subject: 'Auto-package:External: <%= pkg.name %> - <%= contentJson.attributes.title %>',
                html: '<body>\
                    <h2><%= pkg.name %></h2> \
                    <ul> \
                        <li><strong>Instance name</strong>: <%= contentJson.attributes.title %></li> \
                        <li><strong>Build version</strong>: <%= pkg.version %></li> \
                        <li><strong>Date built</strong>: <%= grunt.template.today("dd-mm-yy") %></li> \
                        <li><strong>External Url</strong>: <a href="<%= contentJson.attributes.external.url %>"><%= contentJson.attributes.external.url %></a></li> \
                        <ul> \
                            <li><strong>Username</strong>: <%= contentJson.attributes.external.username %></li> \
                            <li><strong>Password</strong>: <%= contentJson.attributes.external.password %></li> \
                        </ul> \
                        <li><strong>External Url (Auto)</strong>: <a href="<%= contentJson.attributes.external.url %>?uName=<%= contentJson.attributes.external.username %>&pwd=<%= contentJson.attributes.external.password %>"><%= contentJson.attributes.external.url %>?uName=<%= contentJson.attributes.external.username %>&pwd=<%= contentJson.attributes.external.password %></a></li> \
                        <li><strong>Internal Url</strong>: <a href="<%= contentJson.attributes.internal.url %>"><%= contentJson.attributes.internal.url %></a></li> \
                        <li><strong>Zipped package (copy&paste, minecast sometimes breaks)</strong>: <%= getFilesizeInBytes("_Zips/" + contentJson.attributes.title + "_" + pkg.version + "_" + grunt.template.today("dd-mm-yy") + ".zip") %> : <a href="<%= contentJson.attributes.autoPackage.url %><%= pkg.name %>/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today("dd-mm-yy") %>.zip"><%= contentJson.attributes.autoPackage.url %><%= pkg.name %>/<%= contentJson.attributes.title %>_<%= pkg.version %>_<%= grunt.template.today("dd-mm-yy") %>.zip</a></li> \
                        <li><strong>Google tracking id</strong>: <%= contentJson.attributes.googleTrackingID %></li> \
                    </ul> \
                    <h2>Git log</h2> \
                    <ul> \
                        <%= gitLogString %> \
                    </ul> \
                </body>'
            }
        }
    }
}