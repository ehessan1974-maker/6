
    // تحديد تاريخ اليوم والغد
    const اليوم = new Date();
    const تاريخ_اليوم = new Date(اليوم.getFullYear(), اليوم.getMonth(), اليوم.getDate());
    const تاريخ_الغد = new Date(اليوم.getFullYear(), اليوم.getMonth(), اليوم.getDate() + 1);

   function صف_حسب_تاريخ(تاريخ) {
  const اليومString = `${String(تاريخ.getDate()).padStart(2,'0')}/${String(تاريخ.getMonth()+1).padStart(2,'0')}/${تاريخ.getFullYear()}`;
  return prayerTimes.find(row => row["التاريخ ميلادي"] === اليومString);
}


    const صف_اليوم = صف_حسب_تاريخ(تاريخ_اليوم);
    const صف_الغد = صف_حسب_تاريخ(تاريخ_الغد);

    // تحويل النصوص إلى Date
    function وقت_كـDate(قيمة, التاريخ) {
      const [hhmm, period] = قيمة.split(" ");
      let [hours, minutes] = hhmm.split(":").map(Number);
      if (period === "م" && hours < 12) hours += 12;
      if (period === "ص" && hours === 12) hours = 0;
      return new Date(التاريخ.getFullYear(), التاريخ.getMonth(), التاريخ.getDate(), hours, minutes);
    }

    if (صف_اليوم) {
      document.getElementById("الفجر").textContent   = صف_اليوم["الفجر"];
      document.getElementById("الشروق").textContent  = صف_اليوم["الشروق"];
      document.getElementById("الظهر").textContent   = صف_اليوم["الظهر"];
      document.getElementById("العصر").textContent   = صف_اليوم["العصر"];
      document.getElementById("المغرب").textContent  = صف_اليوم["المغرب"];
      document.getElementById("العشاء").textContent  = صف_اليوم["العشاء"];
    } else {
  document.getElementById("باقي للصلاة").textContent = "⚠️ لم يتم العثور على تاريخ اليوم في الملف";
  document.getElementById("باقي لإقامة الصلاة").textContent = "";
}


    const فترات_الإقامة = {
      "الفجر": 30,
      "الظهر": 30,
      "العصر": 20,
      "المغرب": 10,
      "العشاء": 10
    };

    function صيغة_عد(فرق_ميلي) {
      const فرق = Math.max(0, فرق_ميلي);
      const ساعات = Math.floor(فرق / (1000*60*60));
      const دقائق = Math.floor((فرق % (1000*60*60)) / (1000*60));
      const ثواني = Math.floor((فرق % (1000*60)) / 1000);
      return `${ساعات.toString().padStart(2,'0')}:${دقائق.toString().padStart(2,'0')}:${ثواني.toString().padStart(2,'0')}`;
    }

    function تحديث_العد_التنازلي() {
      const الآن = new Date();

      const مواقيت_اليوم = صف_اليوم ? [
        { اسم: "الفجر",   وقت: وقت_كـDate(صف_اليوم["الفجر"], تاريخ_اليوم) },
        { اسم: "الشروق",  وقت: وقت_كـDate(صف_اليوم["الشروق"], تاريخ_اليوم) },
        { اسم: "الظهر",   وقت: وقت_كـDate(صف_اليوم["الظهر"], تاريخ_اليوم) },
        { اسم: "العصر",   وقت: وقت_كـDate(صف_اليوم["العصر"], تاريخ_اليوم) },
        { اسم: "المغرب",  وقت: وقت_كـDate(صف_اليوم["المغرب"], تاريخ_اليوم) },
        { اسم: "العشاء",  وقت: وقت_كـDate(صف_اليوم["العشاء"], تاريخ_اليوم) }
      ] : [];

      let القادمة_للأذان = null;
      for (let i = 0; i < مواقيت_اليوم.length; i++) {
        const وقت_الأذان = مواقيت_اليوم[i].وقت;
        const فترة = فترات_الإقامة[مواقيت_اليوم[i].اسم] || 0;
        const وقت_الإقامة = new Date(وقت_الأذان.getTime() + فترة * 60000);

        if (الآن < وقت_الأذان) {
          القادمة_للأذان = مواقيت_اليوم[i];
          break;
        }
        if (الآن >= وقت_الأذان && الآن < وقت_الإقامة) {
          const التالي = i + 1 < مواقيت_اليوم.length ? مواقيت_اليوم[i + 1] : null;
          if (التالي) القادمة_للأذان = التالي;
          break;
        }
      }

      let الحالية_للإقامة = null;
      for (let i = 0; i < مواقيت_اليوم.length; i++) {
        const وقت_الأذان = مواقيت_اليوم[i].وقت;
        const فترة = فترات_الإقامة[مواقيت_اليوم[i].اسم] || 0;
        const وقت_الإقامة = new Date(وقت_الأذان.getTime() + فترة * 60000);
        if (الآن >= وقت_الأذان && الآن < وقت_الإقامة) {
          الحالية_للإقامة = { اسم: مواقيت_اليوم[i].اسم, وقت_الإقامة };
          break;
        }
      }



      let فرق_أذان = null;
      let فرق_إقامة = null;

      if (القادمة_للأذان) {
        فرق_أذان = القادمة_للأذان.وقت - الآن;
        document.getElementById("باقي للصلاة").textContent =
          `باقي ${صيغة_عد(فرق_أذان)} حتى صلاة ${القادمة_للأذان.اسم}`;
/////////////////////////////////////////////هنا التنبيهات
const alertsPlayed = {
  "alert-15": false,
  "alert-10": false,
  "alert-5": false,
  "adhan": false
};

if (فرق_أذان <= 15*60*1000 && فرق_أذان > 14.75*60*1000 && !alertsPlayed["alert-15"]) {
  document.getElementById("alert-15").play();
  alertsPlayed["alert-15"] = true;
}

if (فرق_أذان <= 10*60*1000 && فرق_أذان > 9.5*60*1000 && !alertsPlayed["alert-10"]) {
  document.getElementById("alert-10").play();
  alertsPlayed["alert-10"] = true;
}

if (فرق_أذان <= 5*60*1000 && فرق_أذان > 4*60*1000 && !alertsPlayed["alert-5"]) {
  document.getElementById("alert-5").play();
  alertsPlayed["alert-5"] = true;
}

////////////////////////////////////////////////////
//if (فرق_أذان <= 0.15*60*1000 && فرق_أذان > 0.14*60*1000) {
 //   const باقي = document.getElementById("باقي للصلاة");

 //   // قراءة النص بصوت
//    const utterance = new SpeechSynthesisUtterance(باقي.textContent);
 //   utterance.lang = "ar-SA"; // اللغة العربية
//    speechSynthesis.speak(utterance);
//}

if (فرق_أذان <= 0.333333333333333*60*1000 && فرق_أذان > 0.316666666666667*60*1000) {
   const bbb = القادمة_للأذان.اسم;
    // قراءة النص بصوت
// النص المطلوب قراءته
const utterance = new SpeechSynthesisUtterance("إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتا... يحينُ الآنْ...موعدُ صلاةِ"+ bbb);

// تحديد اللغة العربية
utterance.lang = "ar-SA"; // اللغة العربية

// تشغيل القراءة
speechSynthesis.speak(utterance);
}
////////////////////////////////////////////////////
if (فرق_أذان <= 0.05*60*1000 && !alertsPlayed["adhan"]) {
  document.getElementById("adhan").play();
  alertsPlayed["adhan"] = true;
}
///////////////////////////////////////////////////
      } else if (صف_الغد) {
        const وقت_فجر_الغد = وقت_كـDate(صف_الغد["الفجر"], تاريخ_الغد);
        فرق_أذان = وقت_فجر_الغد - الآن;
        document.getElementById("باقي للصلاة").textContent =
          `باقي ${صيغة_عد(فرق_أذان)} حتى صلاة الفجر غداً`;
      } else {
        document.getElementById("باقي للصلاة").textContent = "⚠️ لم يتم العثور على تاريخ الغد في الملف";
      }



      if (الحالية_للإقامة) {
        فرق_إقامة = الحالية_للإقامة.وقت_الإقامة - الآن;
        document.getElementById("باقي لإقامة الصلاة").textContent =
          `باقي ${صيغة_عد(فرق_إقامة)} حتى إقامة صلاة ${الحالية_للإقامة.اسم}`;

/////////////////////////////////////////////هنا التنبيهات
const alertsPlayediqama = {
  "iqama": false
};
if (فرق_إقامة <= 0.12*60*1000 && !alertsPlayediqama["iqama"]) {
  document.getElementById("iqama").play();
  alertsPlayediqama["iqama"] = true;
}
///////////////////////////////////////////////////



      } else if (القادمة_للأذان) {
        const فترة = فترات_الإقامة[القادمة_للأذان.اسم] || 0;
        const وقت_إقامة_القادمة = new Date(القادمة_للأذان.وقت.getTime() + فترة * 60000);
        فرق_إقامة = وقت_إقامة_القادمة - الآن;
        document.getElementById("باقي لإقامة الصلاة").textContent =
          `باقي ${صيغة_عد(فرق_إقامة)} حتى إقامة صلاة ${القادمة_للأذان.اسم}`;
      } else if (صف_الغد) {
        const وقت_فجر_الغد = وقت_كـDate(صف_الغد["الفجر"], تاريخ_الغد);
        const وقت_إقامة_الغد = new Date(وقت_فجر_الغد.getTime() + (فترات_الإقامة["الفجر"] || 0) * 60000);

        فرق_إقامة = وقت_إقامة_الغد - الآن;
        document.getElementById("باقي لإقامة الصلاة").textContent =
          `باقي ${صيغة_عد(فرق_إقامة)} حتى إقامة صلاة الفجر غداً`;
      } else {
        document.getElementById("باقي لإقامة الصلاة").textContent = "⚠️ لم يتم العثور على تاريخ الغد في الملف";
      }

      // ✅ تلوين الخانة الأقرب بين العد التنازلي للأذان والإقامة
      const خانة_الأذان = document.getElementById("باقي للصلاة");
      const خانة_الإقامة = document.getElementById("باقي لإقامة الصلاة");

      خانة_الأذان.style.backgroundColor = "";
      خانة_الإقامة.style.backgroundColor = "";

      if (فرق_أذان !== null && فرق_إقامة !== null) {
        if (فرق_أذان <= فرق_إقامة) {
          خانة_الأذان.style.backgroundColor = "lightgreen";
          خانة_الأذان.style.color = "darkred";               
          خانة_الأذان.style.borderTop = "2px solid darkorange";
          خانة_الأذان.style.borderBottom = "2px solid darkorange";
        } else {
          خانة_الإقامة.style.backgroundColor = "lightgreen";
          خانة_الإقامة.style.color = "darkred";
          خانة_الإقامة.style.borderTop = "2px solid darkorange";
          خانة_الإقامة.style.borderBottom = "2px solid darkorange";
        }
      } else if (فرق_أذان !== null) {
        خانة_الأذان.style.backgroundColor = "lightgreen";
        خانة_الأذان.style.color = "darkred";
        خانة_الأذان.style.borderTop = "2px solid darkorange";
        خانة_الأذان.style.borderBottom = "2px solid darkorange";
      } else if (فرق_إقامة !== null) {
        خانة_الإقامة.style.backgroundColor = "lightgreen";
        خانة_الإقامة.style.color = "darkred";
        خانة_الإقامة.style.borderTop = "2px solid darkorange";
        خانة_الإقامة.style.borderBottom = "2px solid darkorange";
      }

      // ✅ تلوين خانة مواقيت الصلاة الأقرب
      const كل_الخانات = ["الفجر","الشروق","الظهر","العصر","المغرب","العشاء"];
      كل_الخانات.forEach(id => {
        document.getElementById(id).style.backgroundColor = "";
        document.getElementById(id).style.color = "";
        document.getElementById(id).style.borderTop = "";
        document.getElementById(id).style.borderBottom = "";
      });

      if (الحالية_للإقامة) {
        document.getElementById(الحالية_للإقامة.اسم).style.backgroundColor = "lightgreen";
        document.getElementById(الحالية_للإقامة.اسم).style.color = "darkred";
        document.getElementById(الحالية_للإقامة.اسم).style.borderTop = "8px solid darkorange";
        document.getElementById(الحالية_للإقامة.اسم).style.borderBottom = "8px solid darkorange";


      } else if (القادمة_للأذان) {
        document.getElementById(القادمة_للأذان.اسم).style.backgroundColor = "lightgreen";
        document.getElementById(القادمة_للأذان.اسم).style.color = "darkred";
        document.getElementById(القادمة_للأذان.اسم).style.borderTop = "8px solid darkorange";
        document.getElementById(القادمة_للأذان.اسم).style.borderBottom = "8px solid darkorange";
            } else if (!القادمة_للأذان && صف_الغد) {
        // ✅ حالة خاصة: قبل منتصف الليل، الفجر القادم هو غداً
        document.getElementById("الفجر").style.backgroundColor = "lightgreen";
        document.getElementById("الفجر").style.color = "darkred";
        document.getElementById("الفجر").style.borderTop = "8px solid darkorange";
        document.getElementById("الفجر").style.borderBottom = "8px solid darkorange";
      }
    } // ← هذا يغلق دالة تحديث_العد_التنازلي

    تحديث_العد_التنازلي();
    setInterval(تحديث_العد_التنازلي, 1000); // تحديث كل ثانية
