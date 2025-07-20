fetch("https://api.lanyard.rest/v1/users/788686743427612673")
  .then(res => res.json())
  .then(data => {
    const user = data.data.discord_user;
    const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`;
    document.getElementById("avatar").src = avatarURL;
    document.getElementById("username").innerText = user.global_name || user.username;
    document.getElementById("status").innerText = "Status: " + data.data.discord_status.toUpperCase();

    const customActivity = data.data.activities.find(a => a.type === 4);
    if (customActivity) {
      document.getElementById("custom-status").innerText = "Custom: " + customActivity.state;
    } else {
      document.getElementById("custom-status").innerText = "No custom status.";
    }
  });
