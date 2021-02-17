# Heroku Update Steps

1. Make sure you are under server folder
2. Follow the command below
`heroku git:remote -a mzecom` (Have to this only once to login)
3. Follow instructions from console (Click any key and log into to heroku once the browser is open)
4. `git add .`
5. `git commit -am "commit message"`
6. `git push heroku master`

```
Summary 

git add .
git commit -am "make it better"
git push heroku master

```

# Heroku initial setup
1. Navigate to https://dashboard.heroku.com/new-app and app name
2. Select on `Heroku Git` from Deployment method
2. Follow given insturctions
```
1. Cd into API root folder

cd server
git init
heroku git:remote -a projectName

2. Deploying the first time

git add .
git commit -am "make it better"
git push heroku master
```
