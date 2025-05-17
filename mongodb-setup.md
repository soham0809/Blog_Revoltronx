# MongoDB Setup Instructions

1. Create a file named `.env.local` in the root directory of your project
2. Add the following line to the file:

```
MONGODB_URI=mongodb+srv://Soham1234:<db_password>@taskcluster.ahmrhok.mongodb.net/?retryWrites=true&w=majority&appName=TaskCluster
```

3. Replace `<db_password>` with your actual MongoDB password

4. Save the file

This will allow your application to connect to your MongoDB database. The `.env.local` file is automatically ignored by git, so your credentials will not be committed to version control.
