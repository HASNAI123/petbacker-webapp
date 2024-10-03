<template>
  <q-page class="row justify-center" padding>
    <div v-if="$i18n.locale == 'en'">
      <div style="text-align:center;">
        <img
          style="max-width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewartop.png"
        >
      </div>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >Points to Look Out For</p>
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>
              1.
              <strong>Misleading you that PetBacker charges fees without informing you the insurance fees</strong> is to ensure safety of your pets, their quality of work and to include insurance coverage of vet fees. Vet fees can be easily around $1000-$3000 for any unfortunate event or accidents that occur during the care of your pet.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              2.
              <strong>Requesting for Cash payment outside the platform to avoid being monitor for quality</strong> by giving you a cheaper price outside without informing you about our reward programme which you may miss out on (eg. free pet taxi voucher, grooming voucher, discount vouchers, 10% off every 5th booking or free merchandise).
            </p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>
              3.
              <strong>Request you to cancel and book them direct</strong> so that they can get the money upfront from you, or to take your dog for other reason as they know you will not be able to leave a transparent review if they did a bad job. You will also not be able to claim back your money if the job is not satisfactory.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              4.
              <strong>Requesting you(pet parent) to revise your booking</strong> from multiple days/visits/walks to one to test their services and to book them directly afterward but did not inform you of the benefits you will miss out on such as insurance, rewards program and service quality guarantee.
            </p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >Benefits</p>
      </div>
      <p>Here are a few of the benefits that you will enjoy when paying through PetBacker for your bookings:</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>1. Your money and pets are Secure and safe as we only release payment to the sitter 2 to 7 days later after the job is completed satisfactorily.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>2. Get credits for Discount for your next booking.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>3. Keep a record of all transactions and able to review the sitter.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>4. Book the Sitter in advance so she know you are serious. Booking fees will be return if sitters can't confirm the job.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit5.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>5. Your pet will be protected by insurance like example, medical insurance.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>6. You can get a pet host/walker to record your Pet's walk route, Pee and Poo locations on a Live GPS map as well as the distance.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit6.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
    </div>
    <div v-else-if="$i18n.locale == 'zhcn'">
      <div style="text-align:center;">
        <img
          style="max-width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewartop-zhcn.png"
        >
      </div>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >要注意的要点</p>
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>
              1.
              <strong>没有告诉您透过 PetBacker 付款将得到免费的保险</strong>，并在工作结束之后才会将款项拨给保姆以保证他们的服务品质。有意误导您有关 PetBacker 对保姆所收取的服务费，忘了提醒您的宠物需要保险，如果在服务期间发生的任何不幸事件，医疗费将可能达到 $1000-$3000 美元左右。
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              2.
              <strong>请求在平台外支付现金</strong>，没有通知您有关您可能错过的PetBacker 奖励计划（例如，免费宠物出租车券，美容券，折扣券，每5次预订可享9折优惠或免费商品），假意向您提供更便宜的价格以跳过平台来避免绩效考核和评论管理。
            </p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>3. 要求您取消平台订单，以便他们可以从您那里获取现金、或因为他们知道无法提供好的服务，不希望您留下评论。在平台以外交易，若服务令您不满意，您也无法要求退款。</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>4. 要求您（宠物父母）修改您的预订，从多天/多次访问/多次步行更改到一次，以测试他们的服务并在之后直接缴交现金。他们将不会通知您，您将错过免费的保险、奖励计划和服务质量之保证。</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >优点/好处</p>
      </div>
      <p>以下是您通过PetBacker预订时享受的一些好处：</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>1. 您的付款以及您的宠物收到保障，因为我们只会在工作完成后的2到7天内拨款给保姆。</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>2. 获取下次预订的折扣。</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>3. 记录所有交易，并能给予保姆评论。</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>4. 提前预订保姆，以便保姆知道您是认真的。如果保姆无法完成工作，将全额退款。</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit5.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>5. 您的宠物将受到保险的保护，例如医疗保险。</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>6. 您可以让宠物保姆在实时GPS地图上记录您宠物的步行路线，便便和尿尿的位置以及步行之距离。</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit6.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
    </div>
    <div v-else-if="$i18n.locale == 'cscz'">
      <div style="text-align:center;">
        <img
          style="max-width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewartop.png"
        >
      </div>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >M&#237;sta, na kter&#225; je potřeba d&#225;t pozor</p>
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>
              1.
              <strong>Klam&#225;n&#237; V&#225;s, že PetBacker požaduje poplatky, aniž by v&#225;s informoval o poplatc&#237;ch pojištěn&#237;</strong> kter&#233; zajišťuje bezpečnost, vašich mazl&#237;čků, jejich kvalitu pr&#225;ce a tak&#233; zahrnuje, poplakty Veterin&#225;ře Poplatky u Veterin&#225;ře se snadno mohou vyšplhat i nad 25 000,- Kč a v&#237;ce u nešťastn&#253;ch ud&#225;lost&#237; nebo nehod, kter&#233; se mohou vyskytnout v průběhu p&#233;če o vašeho dom&#225;c&#237;ho mazl&#237;čka.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              2.
              <strong>Ž&#225;dosti o platbu v Hotovosti mimo platformu, aby se zabr&#225;nilo, kontroly kvality</strong> t&#237;m, že v&#225;m daj&#237; nižš&#237; cenu, mimo PetBacker, aniž by v&#225;s informoval o našem věrnostn&#237;m programu, kter&#253; v&#225;m může přin&#233;st (např. zdarma Pet Taxi voucher,kup&#243;n na profesion&#225;ln&#237; p&#233;či, slevov&#233; pouk&#225;zky, 10% sleva na každou 5. rezervaci nebo zbož&#237; zdarma).
            </p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>
              3.
              <strong>Ž&#225;dost o zrušen&#237; a rezervovat si je např&#237;mo,</strong> tak, aby od V&#225;s dostali pen&#237;ze předem, nebo vz&#237;t vašeho psa z jin&#233;ho důvodu, protože věd&#237;, že nebudete moci zanechat transparentn&#237; hodnocen&#237;, pokud by odvedli špatnou pr&#225;ci. Tak&#233; nebudete moci požadovat či z&#237;skat sv&#233; pen&#237;ze zpět, pokud by pr&#225;ce nebyla uspokojiv&#225;.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              4.
              <strong>Požadovat (majitele mazl&#237;čka) o změnu vaš&#237; rezervace</strong> z v&#237;ce dn&#237;/n&#225;vštěv/proch&#225;zek do jedn&#233; pro otestov&#225;n&#237; jejich služeb a rezervovat je pot&#233; př&#237;mo (mimo PetBacker), bez vašeho informov&#225;n&#237; o v&#253;hod&#225;ch u PetBackeru, a t&#237;m přij&#237;t o v&#253;hody, jako je pojištěn&#237;, odměny program a kvalitn&#237; služby se z&#225;rukou.
            </p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >V&#253;hody</p>
      </div>
      <p>Zde jsou někter&#233; z v&#253;hod, kter&#233; se v&#225;m budou hodit, při placen&#237; přes PetBacker za vaše rezervace:</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>1. Vaše pen&#237;ze a dom&#225;c&#237; mazl&#237;čci jsou v bezpeč&#237; , protože platby odes&#237;l&#225;me po 2 až 7 dnech, později po uspokojivě dokončen&#233; &#250;loze.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>2. Z&#237;skat kredity pro Slevu na vaši př&#237;št&#237; rezervaci.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>3. Uchov&#225;vat z&#225;znamy všech transakc&#237;, a m&#237;t možnost přezkoumat opatrovatele.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>4. Rezervujte si opatrovatele předem, aby věděli, že to mysl&#237;te v&#225;žně. Rezervačn&#237; poplatky budou navr&#225;ceny, pokud opatrovatel&#233; nemohou potvrdit pr&#225;ci.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit5.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>5. V&#225;š mazl&#237;ček bude chr&#225;něn pojištěn&#237;m, jako je např&#237;klad zdravotn&#237; pojištěn&#237;.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>6. Můžete z&#237;skat opatrovatele/venčitele pro z&#225;znam trasy vašeho dom&#225;c&#237;ho Mazl&#237;čka, Čůrac&#237; a Kakac&#237; m&#237;sta nebo Živou GPS mapu, stejně jako vzd&#225;lenost.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit6.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
    </div>
    <div v-else-if="$i18n.locale === 'dede'">
      <div style="text-align:center;">
        <img
          style="max-width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewartop.png"
        >
      </div>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >Punkte auf die man achten sollte</p>
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>
              1.
              <strong>Irref&#252;hren von Nutzern, dass PetBacker Geb&#252;hren erhebt, ohne Sie &#252;ber die Versicherungsgeb&#252;hren zu informieren</strong>um die Sicherheit Ihrer Haustiere, die Qualit&#228;t der Arbeit zu gew&#228;hrleisten und Versicherungsschutz f&#252;r Tierarzt Geb&#252;hren zu enthalten. Tierarzt Geb&#252;hren k&#246;nnen leicht bis zu 3000€ sein f&#252;r jedes ungl&#252;ckliche Ereignis oder Unf&#228;lle, die w&#228;hrend der Pflege Ihres Haustieres auftreten.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              2.
              <strong>Anforderung f&#252;r Barzahlung au&#223;erhalb der Plattform, um die &#220;berwachung von Qualit&#228;t zu vermeiden,</strong>indem Sie einen g&#252;nstigeren Preis au&#223;erhalb angeboten bekommen, ohne Sie &#252;ber unser Pr&#228;mienprogramm das Sie verpassen w&#252;rden zu informieren (z.B. Gratis Tier Taxi Gutschein, Haustierpflege Gutschein, Rabatt Gutscheine oder Aktionen und gratis Handelsaktionen).
            </p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>
              3.
              <strong>Auffordern die Buchung zu stornieren und Sie direkt zu buchen,</strong>sodass sie das Geld im Voraus von Ihnen bekommen oder um Ihren Hund aus anderen Gr&#252;nden zu nehmen, da sie wissen das Sie nicht in der Lage w&#228;ren, eine transparente Bewertung zu hinterlassen, falls sie einen schlechten Job gemacht haben. Sie werden auch nicht in der Lage sein Ihr Geld zur&#252;ckzufordern, wenn der Job nicht zufriedenstellend ist.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              4.
              <strong>Sie (Haustierbesitzer) auffordern Ihre Buchung zu revidieren</strong> von mehreren Tagen/Besuche/Spazierg&#228;nge zu einem zu &#252;berarbeiten, um die Dienstleistungen zu testen und direkt danach die Anstellung durchzuf&#252;hren, aber nicht &#252;ber die Vorteile zu informieren, die dann verpasst werden, wie Versicherung, Pr&#228;mien-Programm und Service-Qualit&#228;tsgarantie.
            </p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >Vorteile</p>
      </div>
      <p>Hier sind ein paar der Vorteile, die Sie genie&#223;en, wenn Sie &#252;ber PetBacker Ihre Buchungen abschlie&#223;en:</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>1. Ihre Haustiere und Bezahlung sind sicher, da wir erst 2 bis 7 Tage sp&#228;ter, nachdem der Job zufriedenstellend abgeschlossen ist die Zahlung an den Sitter freigeben.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>2. Erhalten Sie Punkte f&#252;r Rabatt Gutschriften f&#252;r Ihre n&#228;chste Buchung.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>3. Erhalten Sie eine Aufzeichnung aller Transaktionen und den Sitter bewerten zu k&#246;nnen.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>4. Buchen Sie den Sitter im Voraus, damit man wei&#223; das Sie es ernst meinen. Buchungsgeb&#252;hren werden zur&#252;ckerstattet, wenn der Sitter den Job nicht best&#228;tigen kann.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit5.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>5. Ihr Haustier wird durch Versicherungen wie z.B. Krankenversicherung gesch&#252;tzt sein.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>6. Sie k&#246;nnen einen Haustier-Gastgeber/Spazierg&#228;nger dazu bringen, die Gassi Route Ihres Haustieres, Pipi und H&#228;ufchen Standorte auf einer Live-GPS-Karte sowie die Entfernung, aufzuzeichnen.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit6.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
    </div>
    <div v-else-if="$i18n.locale == 'eses'">
      <div style="text-align:center;">
        <img
          style="max-width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewartop.png"
        >
      </div>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >Puntos a tener en cuenta</p>
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>
              1.
              <strong>Le enga&#241;a dici&#233;ndole que PetBacker cobra tasas sin informarle del coste del seguro</strong> es para garantizar la seguridad de sus mascotas, la calidad de los servicios y para incluir la cobertura del seguro El coste del veterinario puede alcanzar f&#225;cilmente los 1000-3000€ en caso de evento o accidente desafortunado que ocurra durante el cuidado de su mascota.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              2.
              <strong>Solicitar el pago en efectivo fuera de la plataforma para evitar que se analice la calidad</strong> d&#225;ndole un precio m&#225;s barato en el exterior sin informarle acerca de nuestro programa de recompensas (por ejemplo. vale de taxi para mascotas gratis, vale de peluquer&#237;a, vales de descuento, 10% de descuento en cada 5&#170; reserva o art&#237;culo gratis).
            </p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>
              3.
              <strong>Solicitarle que cancele y reserve directamente</strong>para que puedan obtener el dinero por adelantado, ya que saben que usted no podr&#225; dejar una rese&#241;a transparente si hacen un mal trabajo. Tampoco podr&#225; reclamar su dinero si el trabajo no es satisfactorio.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              4.
              <strong>Solicit&#225;ndole que deje una rese&#241;a de su reserva</strong> de varios d&#237;as/visitas/paseos como si se tratase de una sola para probar sus servicios y reservarlos directamente despu&#233;s fuera de la plataforma, pero sin recibir informaci&#243;n de los beneficios que se perder&#225; como seguro, programa de recompensas y garant&#237;a de calidad del servicio.
            </p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >Beneficios</p>
      </div>
      <p>Estas son algunas de las ventajas que disfrutar&#225; al pagar sus reservas a trav&#233;s de PetBacker:</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>1. Su dinero y mascotas est&#225;n asegurados, ya que s&#243;lo liberamos el pago al cuidador en un plazo de 2 a 7 d&#237;as una vez que el trabajo se ha completado satisfactoriamente.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>2. Obtener cr&#233;ditos para descuentos en su pr&#243;xima reserva.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>3. Mantener un registro de todas las transacciones y dejar rese&#241;as al proveedor del servicio.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>4. Reservar el servicio por adelantado para mostrar que vas en serio. Los gastos de reserva ser&#225;n reembolsados si el usuario no confirma el trabajo.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit5.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>5. Su mascota estar&#225; protegida por un seguro como, por ejemplo, seguro m&#233;dico.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>6. Podr&#225; conseguir un paseador que grabe la ruta de su mascota en vivo en un mapa GPS.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit6.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
    </div>
    <div v-else-if="$i18n.locale == 'he'">
      <div style="text-align:center;">
        <img
          style="max-width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewartop.png"
        >
      </div>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >נקודות שצריך לשים לב אליהם</p>
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>
              1.
              <strong>מטעים אותך שפטבאקר גובה עמלות מבלי ליידע אותך בכך שהעמלות</strong>נועדו להבטיח את הבטיחות של חיית המחמד שלך וכוללות בתוכן כיסוי ביטוחי של עלות וטרינרף ובקרת איכות על העבודה של המטפלים. עלות וטרינר יכולה להיות בקלות סביב $3,000-$1,000 ש&quot;ח לכל אירוע או תאונה מצערת שמתרחשת במהלך הטיפול של חיית המחמד שלך.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              2.
              <strong>ביקשו ממך תשלום במזומן מחוץ לפלטפורמה</strong> על ידי הצעת מחיר זול יותר או הנחה מבלי ליידע אותך על תכנית התגמולים שלנו שאתה עלול לפספס על (לדוגמא, שוברי מונית לחיות חינם, שובר לטיפוח, שוברי הנחה בסך 10% על כל הזמנה חמישית או מוצרים בחינם).
            </p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>
              3.
              <strong>מבקשים ממך לבטל ולהזמין אותם באופן ישיר</strong> כך שהם יכולים לקבל ממך את הכסף מראש, או לקחת את הכלב שלך מסיבה אחרת משום שהם יודעים אתה לא תוכל להגיש ביקורת אמיתית וכנה אם הם עשו עבודה רעה. אתה גם לא תהיה מסוגל לתבוע בחזרה את הכסף ששילמת אם העבודה שבוצעה אינה לשביעות רצונך.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              4.
              <strong>מבקשים ממך (בעלי חיית המחמד) לשנות את ההזמנה שלך</strong> ממספר ימים / ביקורים / טיולים לאחד כדי לבדוק את שירותיהם ולהזמין אותם מיד לאחר מכן, אבל לא הודיעו לך על היתרונות שתחמיץ כמו ביטוח, תוכנית התגמולים שלנו והביטחון באיכות השירות שאנחנו מבטיחים.
            </p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >יתרונות</p>
      </div>
      <p>הנה כמה מההטבות שתיהנו מהן כשתשלמו באמצעות פטבאקר עבור ההזמנות שלכם:</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>1. הכסף וחיות המחמד שלכם בטוחים, זאת משום שאנחנו משחררים את התשלום לפט-סיטר רק 2-7 ימים לאחר שהעבודה תושלם באופן משביע רצון.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>2. קבל קרדיטים להנחה להזמנה הבאה שלך.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>3. שמור תיעוד של כל העסקאות והיה מסוגל לבדוק את הפט-סיטר לפני ההעסקה.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>4. הזמן את הפט-סיטר מראש כדי שהוא יידע שאתה רציני. דמי הזמנה יוחזרו אם הפט-סיטרים לא יוכלו לאשר את העבודה.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit5.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>5. חיית המחמד שלך תהיה מוגנת ע&quot;י ביטוח, כמו למשל ביטוח רפואי.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>6. אתה יכול לבקש ממארח חיות / דוג-ווקר להקליט את מסלול ההליכה של חיית המחמד שלך, ולהציג אף את נקודות השתן והקקי על גבי המפה, כמו גם את המרחק של ההליכה.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit6.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
    </div>
    <div v-else-if="$i18n.locale == 'itit'">
      <div style="text-align:center;">
        <img
          style="max-width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewartop.png"
        >
      </div>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >Punti da cercare di ottenere</p>
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>
              1.
              <strong>Riportare alle persone che PetBacker applica delle tasse senza informarli che le tasse per l&#39;assicurazione</strong>servono ad assicurare la sicurezza degli animali, la professionalit&#224; del lavoro e includere la copertura dei costi per il veterinario. Le spese per il veterinario sono intorno ai 1000-3000 euro per qualsiasi sfortunato evento o incidente che dovesse capitare al tuo animale durante i servizi di cura.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              2.
              <strong>Richiedere il pagamento in contanti al di fuori della piattaforma di modo da richiedere un prezzo pi&#249; basso</strong> senza informarvi dei pacchetti offerti da PetBacker (ad esempio free taxi voucher per animali, 10% di sconto ogni 5 prenotazioni etc).
            </p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>
              3.
              <strong>Richiedere di cancellare la prenotazione sulla piattaforma e prenotare dal vivo</strong>in questo modo possono ottenere i soldi direttamente da te senza utilizzare la piattaforma Inoltre non sar&#224; in grado di richiedere indietro il vostro denaro se il lavoro non &#232; soddisfacente.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              4.
              <strong>Richiedere ai proprietari degli animali di rivedere la propria prenotazione</strong> da molteplici giorni/visite/passeggiate ad una di modo da poter provare i servizi e prenotarli direttamente successivamente senza informare le persone di tutti i benefici offerti da PetBacker (assicurazione, programmi di qualit&#224; e professionalit&#224; del servizio).
            </p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >Benefici</p>
      </div>
      <p>Qui ci sono alcuni dei vantaggi che si gode quando le prenotazioni vengono pagate attraverso PetBacker</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>1. I tuoi soldi e animali domestici sono sicuri in quanto rilasciamo solo il pagamento alla sitter dai 2 a 7 giorni dopo che il lavoro &#232; stato completato in modo soddisfacente.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>2. Ottieni crediti per lo sconto per la tua prossima prenotazione.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>3. Mantieni un promemoria di tutte le transazioni di modo da essere in grado di valutare la sitter.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>4. Prenota in anticipo la sitter di modo da assicurare la tua seriet&#224;. Le spese di prenotazione saranno restituite se le sitter non possono confermare lo svolgimento del lavoro.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit5.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>5. Il tuo animale domestico sar&#224; protetto da un&#39;assicurazione come ad esempio assicurazione medica.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>6. &#200; possibile ottenere un host/walker animali domestici per registrare quanto cammina il tuo animale domestico, tramite una mappa GPS live.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit6.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
    </div>
    <div v-else-if="$i18n.locale == 'jajp'">
      <div style="text-align:center;">
        <img
          style="max-width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewartop.png"
        >
      </div>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >注意すべきポイント</p>
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>
              １．
              <strong>保険料について知らせることなく、PetBackerが不当な手数料を取っているというのは誤解です。</strong>手数料はペットの安全、仕事の質、獣医にかかるための保険をカバーしています。何か不幸な出来事や、事故が起こった場合に獣医さんでの医療費は平均で￥10万円～￥30万円かかってしまいます。
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              ２．
              <strong>PetBacker外で現金支払いを要求してくるのは</strong>大概が、お客様が見逃しているかもしれない特典に関してお知らせしないで、安値や割引を提示してくる場合がほとんどです。（特典内容例：無料タクシー券、グルーミング利用券、割引券、5回毎の10%割引、プレゼントなどです。）
            </p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>
              ３．
              <strong>あなたに依頼した仕事をPetBacker上ではキャンセルして直接雇用するように求めてくるのは</strong>手付金を受け取ったり、もし彼らの仕事が酷い内容であったも、あなたがそれを訴える先がないようにするためです。もしあなたが彼らの仕事に満足がいかなくっても、あなたは彼らに返金を求めることもできない。
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              ４．
              <strong>あなたに予約内容を変更するように要求してくるのは</strong>大概が複数日数や回からおためしに1回にするように交渉して、その後大抵の場合直接雇用にするようにいってきます。直接雇用した場合あなたは保険や様々な特典サービスを受けられなくなるだけなく、そもそもサービスの質を保証してもらえなくなります。
            </p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >メリット</p>
      </div>
      <p>ここであなたが PetBacker 上で予約支払いをする際のメリットを紹介:</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>１． 支払いはジョブが満足いくように完了した後の2-7日後シッターさんに支払われるので、あなたのお金とペットは安全です。</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>２． あなたの次の予約で使える割引をゲット。</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>３． すべての支払い記録を保持しとシッターさんのレビューができる</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>４． 事前にシッターさんを予約することで、シッターさんはあなたを信頼できるシッターが仕事を確認できない場合は、予約手数料が返されます。</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit5.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>５． あなたのペットは、医療保険のような保険によって保護されます。</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>６． シッターさんがGPS機能等を使ってあなたのペットのお散歩ルートやうんちやおしっこに関してつけてくれた記録を確認できる。</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit6.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
    </div>
    <div v-else-if="$i18n.locale == 'sksk'">
      <div style="text-align:center;">
        <img
          style="max-width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewartop.png"
        >
      </div>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >Body, na ktor&#233; treba dať pozor</p>
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>
              1.
              <strong>Zav&#225;dzanie, že PetBacker &#250;čtuje poplatky bez informovania.</strong> S&#250; to poplatky pre zabezpečenie bezpečnosti tvojich dom&#225;cich mil&#225;čikov, kvalitu pr&#225;ce a zahŕňaj&#250; taktiež poistenie veterin&#225;rnych poplatkov. Veterin&#225;rne poplatky sa m&#244;žu ľahko okolo $1000-$3000 pre všetky nešťastnej udalosti alebo nehody, ktor&#233; sa vyskytuj&#250; počas starostlivosti o v&#225;šho mil&#225;čika.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              2.
              <strong>Žiadosť o platbu v hotovosti mimo platformy</strong>s pr&#237;sľubom nižšej ceny alebo zľavy bez informovania o našom programe odmien, kde m&#244;žeš z&#237;skať napr. pouk&#225;žku na prevoz zvieraťa zdarma, zľavov&#253; kup&#243;n, tovar zdarma alebo 10% zľavu na každ&#250; piatu rezerv&#225;ciu.
            </p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>
              3.
              <strong>Žiadosť o zrušenie rezerv&#225;cie</strong> s pr&#237;sľubom o vykonan&#237; pr&#225;ce, s cieľom z&#237;skať peniaze vopred. Neriskuj, bezpečnosť a zdravie svojho psa a neukr&#225;ť sa o možnosť nechať transparentn&#233; hodnotenie v pr&#237;pade, že opatrovateľ vykonal zl&#250; pr&#225;cu. Taktiež nebudeš mať n&#225;rok na vr&#225;tenie peňaz&#237; v pr&#237;pade, že pr&#225;ca bola neuspokojiv&#225;.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              4.
              <strong>Žiadať o zrevidovanie tvojej rezerv&#225;cie</strong> z viacer&#253;ch dn&#237;/n&#225;vštev/prech&#225;dzok na jednu pre vysk&#250;šanie služieb, ďalej rezervovať priamo a neinformovať o v&#253;hod&#225;ch, ktor&#233; m&#244;žeš z&#237;skať pri rezerv&#225;cii cez n&#225;s, ako napr. poistenie, program odmien alebo garancia kvality servisu.
            </p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >V&#253;hody</p>
      </div>
      <p>Tu s&#250; niektor&#233; z v&#253;hod, ktor&#233; m&#244;že využ&#237;vať pri platbe tvojich rezerv&#225;ci&#237; cez PetBacker:</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>1. Tvoje peniaze aj zvieratko s&#250; v bezpeč&#237;, nakoľko peniaze vypl&#225;came 2-7 dn&#237; po tom čo opatrovateľ odviedol pr&#225;cu uspokojivo.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>2. Z&#237;skaj kredity na zľavu pre tvoju ďalšiu rezerv&#225;ciu.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>3. Maj z&#225;znamy o všetk&#253;ch transakci&#225;ch a možnosť ohodnotiť opatrovateľa.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>4. Zarezervuj si opatrovateľa v predstihu, aby vedel/a, že m&#225;š seri&#243;zny z&#225;ujem. Rezervačn&#233; poplatky bud&#250; vr&#225;ten&#233; v pr&#237;pade, že opatrovateľ nem&#244;že vykonať pr&#225;cu.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit5.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>5. Tvoje zvieratko bude chr&#225;nen&#253; poisten&#237;m, ako je napr&#237;klad zdravotn&#233; poistenie.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>6. Tvoj opatrovateľ dok&#225;že nahrať trasu prech&#225;dzky do Live GPS mapy a taktiež aj vzdialenosť, ktor&#250; prešiel/la.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit6.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
    </div>
    <div v-else-if="$i18n.locale == 'zhtw' || $i18n.locale == 'zhhk'">
      <div style="text-align:center;">
        <img
          style="max-width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewartop-zhtw.png"
        >
      </div>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >要注意的要點</p>
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>
              1.
              <strong>沒有告訴您透過</strong> PetBacker 付款將得到免費的保險，並在工作結束之後才會將款項撥給保姆以保證他們的服務品質。有意誤導您有關 PetBacker 對保姆所收取的服務費，忘了提醒您的寵物需要保險，如果在服務期間發生的任何不幸事件，醫療費將可能達到 $1000-$3000 美元左右。
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              2.
              <strong>請求在平台外支付現金</strong>，沒有通知您有關您可能錯過的PetBacker 獎勵計劃（例如，免費寵物出租車券，美容券，折扣券，每5次預訂可享9折優惠或免費商品），假意向您提供更便宜的價格以跳過平台來避免績效考核和評論管理。
            </p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>3. 要求您取消平台訂單，以便他們可以從您那裡獲取現金，或因為他們知道無法提供好的服務，不希望您留下評論。在平台以外交易，若服務令您不滿意，您也無法要求退款。</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>4. 要求您（寵物父母）修改您的預訂，從多天/多次訪問/多次步行更改到一次，以測試他們的服務並在之後直接繳交現金。他們將不會通知您，您將錯過免費的保險、獎勵計劃和服務質量之保證。</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-point4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >優點/好處</p>
      </div>
      <p>以下是您通過PetBacker預訂時享受的一些好處：</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit1.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>1. 您的付款以及您的寵物收到保障，因為我們只會在工作完成後的2到7天内撥款給保姆。</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>2. 獲取下次預訂的折扣。</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit2.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit3.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>3. 記錄所有交易，並能給予保姆評論。</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>4. 提前預訂保姆，以便保姆知道您是認真的。如果保姆無法完成工作，將全額退款。</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit4.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit5.png"
              width="100"
              height="100"
            >
          </td>
          <td>
            <p>5. 您的寵物將受到保險的保護，例如醫療保險。</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>6. 您可以讓寵物保姆在實時GPS地圖上記錄您寵物的步行路線，便便和尿尿的位置以及步行之距離。</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-benefit6.png"
              width="100"
              height="100"
            >
          </td>
        </tr>
      </table>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="stylus" scoped>
td {
    padding: 15px;
}
table {
    width: 100%
}
p {
    font-size:14px;
}
div#stripes {
    background-image: linear-gradient(45deg, #9b88b8 25%, #917fac 25%, #917fac 50%, #9b88b8 50%, #9b88b8 75%, #917fac 75%, #917fac);
    background-size: 50px 50px;
}
</style>
