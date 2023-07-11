In this file, write all the credentials needed to access to your application. For example, your app and database credentials.
This information will be used by your CTO and leads to have access some components of your app. 

In addition, you should provide short tutorials to teach people how to access to all the 
components of your application. For instance, if you created a MySQL instance, you must provide 
a short description of how to use the credentials provided here to access to your database instance via ssh or 
using MySQLWorkbench. 

Points will be deducted if teams do not add their credentials here once they have chosen their 
technology stack or if their step-by-step descriptions are not clear enough. You have been warned! 

Web App URL: https://artisan-aura-ifjhxbedya-uw.a.run.app/

<b>Credentials</b>

| Credential   | URL               |Username           | Password        |             
|    :---:     |   :---:           |       :---:       |     :---:       |           
| Google VM    |   35.247.87.15    | root              |  S4nFr4nc1$c0   |                 
|    MySQL     |   34.72.218.74    |  root             |jnrscZTyvbdC1YG/ |                    
|     SSH      |   35.247.87.15    |  talogin          | G0G4t3rs!       |                  
|      -       |                   |                   |                 |                   
|      -       |                   |                   |                 | 


To access SSH:

Option 1: Connect as user TA Login
1. Add SSH key (id_rsa.pub file from /credentials folder) to your local user ~/.ssh folder
2. Open Terminal
3. Enter command: `ssh talogin@35.247.87.15`
4. Successful connection will display as `talogin@artisan-aura`

Option 2: Connect with user account on Google Cloud 
1. Log in to VM Instance on Google Cloud with your gmail account: https://console.cloud.google.com/compute/instances?authuser=1&project=csc-648-848-team-05 
2. Select down arrow next to “SSH” to display options
3. Select gcloud command line
4. Select run in cloud shell
5. Cloud Shell Terminal will open and display connection as `your-username@cloudshell:~ (csc-648-848-team-05) $ gcloud compute ssh --zone "us-west1-b" "artisan-aura" --project "csc-648-848-team-05"`
6. Press Enter to access VM `artisan-aura`
7. Successful connection will display as `your-username@artisan-aura`

Option 3: Generate new SSH key for team member with Google Cloud account

On Mac
1. Open terminal on your personal machine 
2. Enter: `ssh-keygen -t rsa -b 4096 -C "your-username"` (your username for google cloud)
3. To view SSH enter: `cat ~/.ssh/id_rsa.pub`
4. To connect with new SSH, enter command: `ssh your-username@35.247.87.15`
5. Successful connection will display as `your-username@artisan-aura`

On PC
1. https://www.ssh.com/academy/ssh/putty/windows/puttygen 

To access DataBase:

Option 1:
1. Connect to VM via SSH, then to your MySQL instance with the `mysql` command
2. Enter command: `mysql -h 34.72.218.74 -u root -p`
3. Enter password: `jnrscZTyvbdC1YG/`

Option 2: Connect with MySQL Workbench:

1. Setup new connection
2. Connection name: `csc-648-848-team-05:us-central1:artisan-aura-mysql-instance`
3. Connection method: `Standard TCP/IP over SSH`
4. SSH Hostname: `35.247.87.15`
4. SSH Username: `talogin`
6. SSH Password: `G0G4t3rs!`
7. SSH Key File: ~/.ssh/id_rsa (download id_rsa file from /credentials folder)
8. MySQL Hostname: `34.72.218.74`
9. MySQL Server Port: `3306`
10. Username: `root`
11. Password: `jnrscZTyvbdC1YG/`
12. Default Schema: (Leave blank to select later)

SSH Key: 

1. id_rsa.pub and id_rsa files located in credential folder
2. ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCrAlLgZGSZBYaqoo/pv3kpNZq+1HhAxffHp36nOOYeCit8He1Smn1Ajzo/gPHPqFVgY/k/NjGUU18Fw1DfsiOJRZx7cqrjshcSOqLDXXpYnd8slNLhexVyk+tluGXkVaNDWr6byyBk+yoL7ldQ7QbrwbExSC1yq+Gytj9mj4WHttw2i8U3z2IE8lh4tZROQEz07JdLG7xrH2QrIXrFRGx9ABliPOJYGyE/YD+HlnjHF0PFpFlNKpXUUz3Qe0mIYTPriAT/ttGGZl7Jsh0V3YMyzMrOTL7eKLKbs0F76vu39fgFhxvarRcqLRt3DPwbl6BYjDnOYtZxuOH2h/Ix5woi3tNpKJ1kURt0yJiiVhuCnhBy420MizHfuJBOegbPbHW/xdwpssrbn60GXoHnytaq+2nIzYplnfmAQDeWOwGJsO7h8wpXRdVjKSJxrGDf2bH+cjfXTEXixoCv3QWqAWeiqAqsWBvkku1vnKes2getNZUKqTD/X3qnmwBjfMPp4c07sIQoSw+lq2uOTxa5RpEsvHR2EiimLXON5VFz2pYCdlJ1x1b1+wGRqUjZJHlFpUNOo3k3g0sJjy5zMPLwiKNiycb/ofz7n3gxDEGIQZJsCpsnCm2Dnw1l+1bvBl7ruKzvDJEPmk6da7xMwz8SGXPrArX0ebJhzJRSik8lug8CAQ== talogin

Google Compute Engine:
1. https://console.cloud.google.com/compute/instances?authuser=1&project=csc-648-848-team-05

Cloud SQL Instance on Google VM:
1. https://console.cloud.google.com/sql/instances/artisan-aura-mysql-instance/overview?authuser=1&project=csc-648-848-team-05

