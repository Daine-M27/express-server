<h1>Calm Stats</h1>
<p> CalmStats is a responsive full-stack web app that allows users to chart the amount of time they spend in meditation each day.</p>
<img src="https://calmstats.com/homepage1.png">

<h2>Introduction</h2>
<p>The main focus of Calm Stats is to promote the use of meditation to improve daily life and medical conditions. Meditation is a proven skill that anyone can use to improve their life.</p>

<h2>How it Works</h2>
<h3>Record Meditation Sessions</h3>
<p>Each time a user records there meditation with Calm Stats a graph displays the results from each session when the session is complete. Calm Stats allows a user to see their daily habits visually which helps reinforce daily habits.</p>


<h2>Wireframes</h2>
<p>Wireframes were created for each page.  A simple informative layout was chosen to keep a clean look and feel.</p>
<p>A live version of the wireframes can be see at  <span><a href="https://daine-m27.github.io/finalCapstone">Calm Stats Wireframes</a></span></p>
<img src="https://calmstats.com/wireframes.png">

<h2>Technology</h2>
<h3>Front End</h3>
<ul>
  <li>React</li>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
  <li><a href="https://getbootstrap.com">Bootstrap</a></li>
  <li><a href="https://fontawesome.io">FontAwesome</a> for icons</li>
  <li><a href="https://chartjs.org">ChartJS</a></li>
  <li><a href="https://auth0.com">Auth0</a> for user authentication</li>
  <li>Continuous integration and deployment with <a href="https://travis-ci.org">TravisCI</a></li>
  <li>Hosted at <a href="https://netlify.com">Netlify</a></li>
  <li>Testing with <a href="https://github.com/airbnb/enzyme">Enzyme</a></li>
  <li>SSL Certificate through <a href="https://letsencrypt.org">Letsencrypt</a></li>
</ul>
<h3>Back End</h3>
<ul>
  <li>Node.js with Express.js on separately hosted web server at Heroku.com</li>
  <li>Moment.js for time manipulation <a href="https://momentjs.com">MomentJS</li>
  <li>Testing with <a href="https://mochajs.org/">Mocha</a> + <a href="http://chaijs.com/">Chai</a></li>
  <li>Continuous integration and deployment with <a href="https://travis-ci.org/">Travis CI</a></li>
  <li>Continuous integration and deployment with <a href="https://heroku.com">Heroku</a></li>
</ul>
<h3>Database</h3>
<ul>
    <li>MongoDB separately hosted at <a href="https://www.mlab.com">MLab</a></li>
</ul>
<h3>Responsive</h3>
<ul>
  <li>The app was built to be responsive and adjusts for any size screen.</li>
</ul>
<h3>Security</h3>
<ul>
  <li>All credentials are verified with Auth0 to provide multiple login methods.</li>
  <li>A token from Auth0 is passed along and checked with each request to verify user identity</li>
</ul>

