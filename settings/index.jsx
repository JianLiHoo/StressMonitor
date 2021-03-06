function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">IFTTT Settings</Text>}>
        <Text>Login to IFTTT.com, add a new Applet, If `WebHook`, then `Home Connect Coffee`.</Text>
        <Text>Create 3 events: <Text bold>coffee_off</Text>, <Text bold>coffee_on</Text> and <Text bold>coffee_make</Text>.</Text>
        <Text>Enter API Key below. Find yours here: https://ifttt.com/services/maker_webhooks/settings</Text>
        <TextInput
          label="IFTTT API Key"
          settingsKey="apiKey"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);