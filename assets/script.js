fetch("https://api.lanyard.rest/v1/users/788686743427612673")
  .then(res => res.json())
  .then(data => {
    const user = data.data.discord_user;

    const avatarURL = user.avatar.startsWith("a_")
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif?size=4096`
      : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096`;
    document.getElementById("avatar").src = avatarURL;

    document.getElementById("username").innerText = user.display_name || user.username;
    document.getElementById("global").innerText = `Global Name: ${user.global_name || "-"}`;

    const clan = user.primary_guild?.tag;
    if (clan) {
      document.getElementById("clan").innerText = `Clan: ${clan}`;
    }

    const badge = user.primary_guild?.badge;
    if (badge) {
      document.getElementById("badge").innerHTML = `<img src="https://cdn.discordapp.com/badges/${badge}.png" alt="Badge" style="height:40px;">`;
    }

    document.getElementById("status").innerText = "Status: " + data.data.discord_status.toUpperCase();

    const customActivity = data.data.activities.find(a => a.type === 4);
    if (customActivity) {
      document.getElementById("custom-status").innerText = "Custom: " + customActivity.state;
    } else {
      document.getElementById("custom-status").innerText = "No custom status.";
    }

    const bannerUrl = `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=4096`;
    fetch(bannerUrl).then(b => {
      if (b.status === 200) {
        document.getElementById("banner").src = bannerUrl;
      } else {
        document.getElementById("banner").style.display = "none";
      }
    });
  });
