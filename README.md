# Stress Monitor for Fitbit

Uses the Fitbit Ionic HR monitor to get an average heart rate which we correlate to stress levels, based on research papers from medical studies.
The app allows users to remain discrete about their stress levels; a main screen displays time, heart rate and step count 
while a second screen shows the users stress level. The user can move between screens by tapping it.

The stress level screen makes use of gentle calming colors and short reminders for the users to adopt to keep their stress 
under control. Haptic feedback is also used to gently reinforce the reminders.

The main screen also features a simple battery level and charge indicator.

The app then sends the information to a dashboard application. This dashboard application will then allow enterprises to 
have an overview of the company's mental health status. For AngelHack SF 2018, we made use of IFTTT webhooks to simulate 
this data transfer. The fitbit app sends an event to the companion app, which would then trigger the IFTTT applet and send an sms. 
