module.exports.randomImage = (gender) => {
   const icons = {
      man: ["icon1.jpg", "icon2.jpg", "icon3.jpg", "icon4.jpg", "icon5.jpg"],
      woman: ["icon6.jpg", "icon7.jpg", "icon8.jpg", "icon9.jpg", "icon10.jpg"],
   };

   const randomizer = Math.floor(Math.random() * 5);

   if (gender === "pria" || gender === "laki-laki") {
      return icons.man[randomizer];
   } else if (gender === "perempuan" || gender === "wanita") {
      return icons.woman[randomizer];
   } else {
      return "There are only two genders, FOOL";
   }
};
