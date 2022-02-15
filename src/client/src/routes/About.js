function About() {
    return (
        <>  
            <p>
                Sammelband is a an article-collation service. You enter a bunch of URLs to articles you 
                want to read later, and get a single (HTML | PDF | EPUB) file in return. The web pages are 
                processed using Readability to extract the relevant content, and styled for a pleasant reading
                experience. 
            </p>
            
            <h3>Why?</h3>
            <p>
                There are many heavy hitters in the bookmarking/read-it-later space, such as Pocket,
                Instapaper, Pinboard, and <a href="https://hn.algolia.com/?dateRange=all&page=0&prefix=true&query=show%20hn%20bookmark&sort=byPopularity&type=story">
                    many more
                </a>.

                I made this on a whim before a long flight, just as I was desperately trying to close 
                some of my thousands of browser tabs. 

                My aim is not to replace any of the aforementioned apps (I'm a longtime user of Pocket
                myself). I'm not trying to reinvent archival or knowledge management here. Rather, 
                I see Sammelband as a useful, short-term tool that helps me to get some reading done,
                say when a long trip comes up. 
            </p>
         
            
            <h3>Acknowledgments</h3>
            <ul>
                <li>forlater.email</li>
            </ul>
            <h3>How to use</h3>
            <h3>Technical stuff</h3>
            <h4>Back-end</h4>
            <ul>
                <li>Express</li>
                <li>Redis</li>
                <li>Readability by Mozilla</li>
                <li>Puppeteer</li>
                <li>Nodemailer</li>
            </ul>
            <h4>Front-end</h4>
            <ul>
                <li>React</li>
                <li>sakura.css</li>
                <li>Feather Icons</li>
            </ul>
            
            <h3>Sammelwhat?</h3>
            <p><a href="https://en.wikipedia.org/wiki/Sammelband">Sammelband</a></p>
        </>
    )
}

export default About;