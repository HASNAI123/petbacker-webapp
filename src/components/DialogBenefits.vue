<template>
  <q-dialog v-model="modal" @hide="onClose" :maximized="$q.platform.is.mobile" transition-hide="slide-down" transition-show="slide-up">
    <q-card>
      <q-toolbar class="q-pl-xs">
        <q-btn flat round dense v-close-popup size="lg" icon="chevron_left"/>
        <q-toolbar-title v-close-popup>
          <h6 class="q-my-none benefits-title">{{$t('benefits.title')}}</h6>
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section class="q-pt-none">
            <div v-if="$i18n.locale == 'en'">
      <div style="text-align:center;">
        <img
          style="width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam-Alert-1.jpg"
        />
      </div>
      <div style="text-align:center;">
        <img
          style="width:50%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-15.jpg"
        />
      </div>
      <p
        style="font-weight: 600; padding: 15px; text-align: center;"
      >Here are a few of the benefits that you will enjoy when paying through PetBacker for your bookings:</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-08-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Your money and pets are Secure and safe as we only release payment to the sitter 2 to 7 days later after the job is completed satisfactorily.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>Get credits for Discount for your next booking.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-09-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-10-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Keep a record of all transactions and able to review the sitter.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>Book the Sitter in advance so she know you are serious. Booking fees will be return if sitters can't confirm the job.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-11-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-12-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Your pet will be protected by insurance like example, medical insurance.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>You can get a pet host/walker to record your Pet's walk route, Pee and Poo locations on a Live GPS map as well as the distance.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-13-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <div style="text-align:center;">
        <img
          style="width:100%; padding: 20 0 20 0;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-14.jpg"
        />
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-04-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>Misleading you that PetBacker charges fees without informing you the insurance fees</strong> is to ensure safety of your pets, their quality of work and to include insurance coverage of vet fees. Vet fees can be easily around $1000-$3000 for any unfortunate event or accidents that occur during the care of your pet.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>Requesting for cash payment outside the platform to avoid being monitor for quality</strong> by giving you a cheaper price outside without informing you about our reward programme which you may miss out on (eg. free pet taxi voucher, grooming voucher, discount vouchers, 10% off every 5th booking or free merchandise).
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-05-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-06-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>Request you to cancel and book them direct</strong> so that they can get the money upfront from you, or to take your dog for other reason as they know you will not be able to leave a transparent review if they did a bad job. You will also not be able to claim back your money if the job is not satisfactory.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>Requesting you (pet parent) to revise your booking</strong> from multiple days/visits/walks to one to test their services and to book them directly afterward but did not inform you of the benefits you will miss out on such as insurance, rewards program and service quality guarantee.
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-07-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
    </div>
    <div v-if="$i18n.locale == 'elel'">
      <div style="text-align:center;">
        <img
          style="width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam-Alert-1.jpg"
        />
      </div>
      <div style="text-align:center;">
        <img
          style="width:50%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-15.jpg"
        />
      </div>
      <p
        style="font-weight: 600; padding: 15px; text-align: center;"
      >Here are a few of the benefits that you will enjoy when paying through PetBacker for your bookings:</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-08-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Your money and pets are Secure and safe as we only release payment to the sitter 2 to 7 days later after the job is completed satisfactorily.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>Get credits for Discount for your next booking.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-09-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-10-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Keep a record of all transactions and able to review the sitter.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>Book the Sitter in advance so she know you are serious. Booking fees will be return if sitters can't confirm the job.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-11-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-12-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Your pet will be protected by insurance like example, medical insurance.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>You can get a pet host/walker to record your Pet's walk route, Pee and Poo locations on a Live GPS map as well as the distance.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-13-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <div style="text-align:center;">
        <img
          style="width:100%; padding: 20 0 20 0;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-14.jpg"
        />
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-04-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>Misleading you that PetBacker charges fees without informing you the insurance fees</strong> is to ensure safety of your pets, their quality of work and to include insurance coverage of vet fees. Vet fees can be easily around $1000-$3000 for any unfortunate event or accidents that occur during the care of your pet.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>Requesting for cash payment outside the platform to avoid being monitor for quality</strong> by giving you a cheaper price outside without informing you about our reward programme which you may miss out on (eg. free pet taxi voucher, grooming voucher, discount vouchers, 10% off every 5th booking or free merchandise).
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-05-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-06-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>Request you to cancel and book them direct</strong> so that they can get the money upfront from you, or to take your dog for other reason as they know you will not be able to leave a transparent review if they did a bad job. You will also not be able to claim back your money if the job is not satisfactory.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>Requesting you (pet parent) to revise your booking</strong> from multiple days/visits/walks to one to test their services and to book them directly afterward but did not inform you of the benefits you will miss out on such as insurance, rewards program and service quality guarantee.
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-07-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
    </div>
    <div v-else-if="$i18n.locale == 'zhcn'">
      <div style="text-align:center;">
        <img
          style="width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert-19.jpg"
        />
      </div>
      <!--BENEFITS-->
      <div style="text-align:center;">
        <img
          style="width:50%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert-25.jpg"
        />
      </div>
      <p style="font-weight: 600; padding: 15px; text-align: center;">以下是您通过PetBacker预订时享受的一些好处：</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-08-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>您的付款以及您的宠物收到保障，因为我们只会在工作完成后的2到7天内拨款给保姆。</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>获取下次预订的折扣。</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-09-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-10-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>记录所有交易，并能给予保姆评论。</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>提前预订保姆，以便保姆知道您是认真的。如果保姆无法完成工作，将全额退款。</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-11-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-12-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>您的宠物将受到保险的保护，例如医疗保险。</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>您可以让宠物保姆在实时GPS地图上记录您宠物的步行路线，便便和尿尿的位置以及步行之距离。</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-13-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <!--SCAMMING BEHAVIOURS TO LOOK OUT-->
      <div style="text-align:center;">
        <img
          style="width:100%; padding: 20 0 20 0;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert-24.jpg"
        />
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-04-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>没有告诉您透过 PetBacker 付款将得到免费的保险，</strong> 并在工作结束之后才会将款项拨给保姆以保证他们的服务品质。有意误导您有关 PetBacker 对保姆所收取的服务费，忘了提醒您的宠物需要保险，如果在服务期间发生的任何不幸事件，医疗费将可能达到 $1000-$3000 美元左右。
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>请求在平台外支付现金，</strong> 没有通知您有关您可能错过的PetBacker 奖励计划（例如，免费宠物出租车券，美容券，折扣券，每5次预订可享9折优惠或免费商品），假意向您提供更便宜的价格以跳过平台来避免绩效考核和评论管理。
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-05-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-06-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>要求您取消平台订单，</strong> 以便他们可以从您那里获取现金、或因为他们知道无法提供好的服务，不希望您留下评论。在平台以外交易，若服务令您不满意，您也无法要求退款。
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>要求您（宠物父母）修改您的预订，</strong> 从多天/多次访问/多次步行更改到一次，以测试他们的服务并在之后直接缴交现金。他们将不会通知您，您将错过免费的保险、奖励计划和服务质量之保证。
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-07-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
    </div>
    <div v-else-if="$i18n.locale == 'cscz'">
      <div style="text-align:center;">
        <img
          style="width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam-Alert-1.jpg"
        />
      </div>
      <!--BENEFITS-->
      <div style="text-align:center;">
        <img
          style="width:50%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-15.jpg"
        />
      </div>
      <p
        style="font-weight: 600; padding: 15px; text-align: center;"
      >Zde jsou některé z výhod, které se vám budou hodit, při placení přes PetBacker za vaše rezervace:</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-08-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Vaše peníze a domácí mazlíčci jsou v bezpečí , protože platby odesíláme po 2 až 7 dnech, později po uspokojivě dokončené úloze.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>Získat kredity pro Slevu na vaši příští rezervaci.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-09-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-10-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Uchovávat záznamy všech transakcí, a mít možnost přezkoumat opatrovatele.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>Rezervujte si opatrovatele předem, aby věděli, že to myslíte vážně. Rezervační poplatky budou navráceny, pokud opatrovatelé nemohou potvrdit práci.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-11-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-12-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Váš mazlíček bude chráněn pojištěním, jako je například zdravotní pojištění.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>Můžete získat opatrovatele/venčitele pro záznam trasy vašeho domácího Mazlíčka, Čůrací a Kakací místa nebo Živou GPS mapu, stejně jako vzdálenost.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-13-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <!--SCAMMING BEHAVIOURS TO LOOK OUT-->
      <div style="text-align:center;">
        <img
          style="width:100%; padding: 20 0 20 0;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-14.jpg"
        />
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-04-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>Klamání Vás, že PetBacker požaduje poplatky, aniž by vás informoval o poplatcích pojištění</strong> které zajišťuje bezpečnost, vašich mazlíčků, jejich kvalitu práce a také zahrnuje, poplakty Veterináře Poplatky u Veterináře se snadno mohou vyšplhat i nad 25 000,- Kč a více u nešťastných událostí nebo nehod, které se mohou vyskytnout v průběhu péče o vašeho domácího mazlíčka.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>Žádosti o platbu v Hotovosti mimo platformu, aby se zabránilo, kontroly kvality</strong> tím, že vám dají nižší cenu, mimo PetBacker, aniž by vás informoval o našem věrnostním programu, který vám může přinést (např. zdarma Pet Taxi voucher,kupón na profesionální péči, slevové poukázky, 10% sleva na každou 5. rezervaci nebo zboží zdarma).
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-05-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-06-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>Žádost o zrušení a rezervovat si je napřímo,</strong> tak, aby od Vás dostali peníze předem, nebo vzít vašeho psa z jiného důvodu, protože vědí, že nebudete moci zanechat transparentní hodnocení, pokud by odvedli špatnou práci. Také nebudete moci požadovat či získat své peníze zpět, pokud by práce nebyla uspokojivá.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>Požadovat (majitele mazlíčka) o změnu vaší rezervace</strong> z více dní/návštěv/procházek do jedné pro otestování jejich služeb a rezervovat je poté přímo (mimo PetBacker), bez vašeho informování o výhodách u PetBackeru, a tím přijít o výhody, jako je pojištění, odměny program a kvalitní služby se zárukou.
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-07-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
    </div>
    <div v-else-if="$i18n.locale === 'dede'">
      <div style="text-align:center;">
        <img
          style="width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam-Alert-1.jpg"
        />
      </div>
      <!--BENEFITS-->
      <div style="text-align:center;">
        <img
          style="width:50%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-15.jpg"
        />
      </div>
      <p
        style="font-weight: 600; padding: 15px; text-align: center;"
      >Hier sind ein paar der Vorteile, die Sie genießen, wenn Sie über PetBacker Ihre Buchungen abschließen:</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-08-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Ihre Haustiere und Bezahlung sind sicher, da wir erst 2 bis 7 Tage später, nachdem der Job zufriedenstellend abgeschlossen ist die Zahlung an den Sitter freigeben.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>Erhalten Sie Punkte für Rabatt Gutschriften für Ihre nächste Buchung.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-09-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-10-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Erhalten Sie eine Aufzeichnung aller Transaktionen und den Sitter bewerten zu können.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>Buchen Sie den Sitter im Voraus, damit man weiß das Sie es ernst meinen. Buchungsgebühren werden zurückerstattet, wenn der Sitter den Job nicht bestätigen kann.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-11-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-12-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Ihr Haustier wird durch Versicherungen wie z.B. Krankenversicherung geschützt sein.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>Sie können einen Haustier-Gastgeber/Spaziergänger dazu bringen, die Gassi Route Ihres Haustieres, Pipi und Häufchen Standorte auf einer Live-GPS-Karte sowie die Entfernung, aufzuzeichnen.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-13-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <!--SCAMMING BEHAVIOURS TO LOOK OUT-->
      <div style="text-align:center;">
        <img
          style="width:100%; padding: 20 0 20 0;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-14.jpg"
        />
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-04-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>Irreführen von Nutzern, dass PetBacker Gebühren erhebt, ohne Sie über die Versicherungsgebühren zu informieren</strong> um die Sicherheit Ihrer Haustiere, die Qualität der Arbeit zu gewährleisten und Versicherungsschutz für Tierarzt Gebühren zu enthalten. Tierarzt Gebühren können leicht bis zu 3000€ sein für jedes unglückliche Ereignis oder Unfälle, die während der Pflege Ihres Haustieres auftreten.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>Anforderung für Barzahlung außerhalb der Plattform, um die Überwachung von Qualität zu vermeiden,</strong> indem Sie einen günstigeren Preis außerhalb angeboten bekommen, ohne Sie über unser Prämienprogramm das Sie verpassen würden zu informieren (z.B. Gratis Tier Taxi Gutschein, Haustierpflege Gutschein, Rabatt Gutscheine oder Aktionen und gratis Handelsaktionen).
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-05-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-06-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>Auffordern die Buchung zu stornieren und Sie direkt zu buchen,</strong> sodass sie das Geld im Voraus von Ihnen bekommen oder um Ihren Hund aus anderen Gründen zu nehmen, da sie wissen das Sie nicht in der Lage wären, eine transparente Bewertung zu hinterlassen, falls sie einen schlechten Job gemacht haben. Sie werden auch nicht in der Lage sein Ihr Geld zurückzufordern, wenn der Job nicht zufriedenstellend ist.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>Sie (Haustierbesitzer) auffordern Ihre Buchung zu revidieren</strong> von mehreren Tagen/Besuche/Spaziergänge zu einem zu überarbeiten, um die Dienstleistungen zu testen und direkt danach die Anstellung durchzuführen, aber nicht über die Vorteile zu informieren, die dann verpasst werden, wie Versicherung, Prämien-Programm und Service-Qualitätsgarantie.
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-07-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
    </div>
    <div v-else-if="$i18n.locale == 'eses'">
      <div style="text-align:center;">
        <img
          style="width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam-Alert-1.jpg"
        />
      </div>
      <!--BENEFITS-->
      <div style="text-align:center;">
        <img
          style="width:50%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-15.jpg"
        />
      </div>
      <p
        style="font-weight: 600; padding: 15px; text-align: center;"
      >Estas son algunas de las ventajas que disfrutará al pagar sus reservas a través de PetBacker:</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-08-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Su dinero y mascotas están asegurados, ya que sólo liberamos el pago al cuidador en un plazo de 2 a 7 días una vez que el trabajo se ha completado satisfactoriamente.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>Obtener créditos para descuentos en su próxima reserva.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-09-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-10-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Mantener un registro de todas las transacciones y dejar reseñas al proveedor del servicio.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>Reservar el servicio por adelantado para mostrar que vas en serio. Los gastos de reserva serán reembolsados si el usuario no confirma el trabajo.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-11-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-12-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Su mascota estará protegida por un seguro como, por ejemplo, seguro médico.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>Podrá conseguir un paseador que grabe la ruta de su mascota en vivo en un mapa GPS.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-13-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <!--SCAMMING BEHAVIOURS TO LOOK OUT-->
      <div style="text-align:center;">
        <img
          style="width:100%; padding: 20 0 20 0;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-14.jpg"
        />
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-04-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>Le engaña diciéndole que PetBacker cobra tasas sin informarle del coste del seguro</strong> es para garantizar la seguridad de sus mascotas, la calidad de los servicios y para incluir la cobertura del seguro El coste del veterinario puede alcanzar fácilmente los 1000-3000€ en caso de evento o accidente desafortunado que ocurra durante el cuidado de su mascota.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>Solicitar el pago en efectivo fuera de la plataforma para evitar que se analice la calidad</strong> dándole un precio más barato en el exterior sin informarle acerca de nuestro programa de recompensas (por ejemplo. vale de taxi para mascotas gratis, vale de peluquería, vales de descuento, 10% de descuento en cada 5ª reserva o artículo gratis).
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-05-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-06-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>Solicitarle que cancele y reserve directamente</strong> para que puedan obtener el dinero por adelantado, ya que saben que usted no podrá dejar una reseña transparente si hacen un mal trabajo. Tampoco podrá reclamar su dinero si el trabajo no es satisfactorio.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>Solicitándole que deje una reseña de su reserva</strong> de varios días/visitas/paseos como si se tratase de una sola para probar sus servicios y reservarlos directamente después fuera de la plataforma, pero sin recibir información de los beneficios que se perderá como seguro, programa de recompensas y garantía de calidad del servicio.
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-07-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
    </div>
    <div v-else-if="$i18n.locale == 'he'">
      <div style="text-align:center;">
        <img
          style="width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam-Alert-1.jpg"
        />
      </div>
      <!--BENEFITS-->
      <div style="text-align:center;">
        <img
          style="width:50%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-15.jpg"
        />
      </div>
      <p
        style="font-weight: 600; padding: 15px; text-align: center;"
      >הנה כמה מההטבות שתיהנו מהן כשתשלמו באמצעות פטבאקר עבור ההזמנות שלכם:</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-08-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>הכסף וחיות המחמד שלכם בטוחים, זאת משום שאנחנו משחררים את התשלום לפט-סיטר רק 2-7 ימים לאחר שהעבודה תושלם באופן משביע רצון.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>קבל קרדיטים להנחה להזמנה הבאה שלך.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-09-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-10-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>שמור תיעוד של כל העסקאות והיה מסוגל לבדוק את הפט-סיטר לפני ההעסקה.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>הזמן את הפט-סיטר מראש כדי שהוא יידע שאתה רציני. דמי הזמנה יוחזרו אם הפט-סיטרים לא יוכלו לאשר את העבודה.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-11-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-12-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>חיית המחמד שלך תהיה מוגנת ע"י ביטוח, כמו למשל ביטוח רפואי.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>אתה יכול לבקש ממארח חיות / דוג-ווקר להקליט את מסלול ההליכה של חיית המחמד שלך, ולהציג אף את נקודות השתן והקקי על גבי המפה, כמו גם את המרחק של ההליכה.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-13-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <!--SCAMMING BEHAVIOURS TO LOOK OUT-->
      <div style="text-align:center;">
        <img
          style="width:100%; padding: 20 0 20 0;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-14.jpg"
        />
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-04-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>מטעים אותך שפטבאקר גובה עמלות מבלי ליידע אותך בכך שהעמלות</strong>נועדו להבטיח את הבטיחות של חיית המחמד שלך וכוללות בתוכן כיסוי ביטוחי של עלות וטרינרף ובקרת איכות על העבודה של המטפלים. עלות וטרינר יכולה להיות בקלות סביב $3,000-$1,000 ש"ח לכל אירוע או תאונה מצערת שמתרחשת במהלך הטיפול של חיית המחמד שלך.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>ביקשו ממך תשלום במזומן מחוץ לפלטפורמה</strong> על ידי הצעת מחיר זול יותר או הנחה מבלי ליידע אותך על תכנית התגמולים שלנו שאתה עלול לפספס על (לדוגמא, שוברי מונית לחיות חינם, שובר לטיפוח, שוברי הנחה בסך 10% על כל הזמנה חמישית או מוצרים בחינם).
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-05-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-06-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>מבקשים ממך לבטל ולהזמין אותם באופן ישיר</strong> כך שהם יכולים לקבל ממך את הכסף מראש, או לקחת את הכלב שלך מסיבה אחרת משום שהם יודעים אתה לא תוכל להגיש ביקורת אמיתית וכנה אם הם עשו עבודה רעה. אתה גם לא תהיה מסוגל לתבוע בחזרה את הכסף ששילמת אם העבודה שבוצעה אינה לשביעות רצונך.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>מבקשים ממך (בעלי חיית המחמד) לשנות את ההזמנה שלך</strong> ממספר ימים / ביקורים / טיולים לאחד כדי לבדוק את שירותיהם ולהזמין אותם מיד לאחר מכן, אבל לא הודיעו לך על היתרונות שתחמיץ כמו ביטוח, תוכנית התגמולים שלנו והביטחון באיכות השירות שאנחנו מבטיחים.
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-07-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
    </div>
    <div v-else-if="$i18n.locale == 'itit'">
      <div style="text-align:center;">
        <img
          style="width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam-Alert-1.jpg"
        />
      </div>
      <!--BENEFITS-->
      <div style="text-align:center;">
        <img
          style="width:50%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-15.jpg"
        />
      </div>
      <p
        style="font-weight: 600; padding: 15px; text-align: center;"
      >Qui ci sono alcuni dei vantaggi che si gode quando le prenotazioni vengono pagate attraverso PetBacker</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-08-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>I tuoi soldi e animali domestici sono sicuri in quanto rilasciamo solo il pagamento alla sitter dai 2 a 7 giorni dopo che il lavoro è stato completato in modo soddisfacente.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>Ottieni crediti per lo sconto per la tua prossima prenotazione.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-09-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-10-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Mantieni un promemoria di tutte le transazioni di modo da essere in grado di valutare la sitter.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>Prenota in anticipo la sitter di modo da assicurare la tua serietà. Le spese di prenotazione saranno restituite se le sitter non possono confermare lo svolgimento del lavoro.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-11-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-12-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Il tuo animale domestico sarà protetto da un'assicurazione come ad esempio assicurazione medica.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>È possibile ottenere un host/walker animali domestici per registrare quanto cammina il tuo animale domestico, tramite una mappa GPS live.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-13-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <!--SCAMMING BEHAVIOURS TO LOOK OUT-->
      <div style="text-align:center;">
        <img
          style="width:100%; padding: 20 0 20 0;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-14.jpg"
        />
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-04-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>Riportare alle persone che PetBacker applica delle tasse senza informarli che le tasse per l'assicurazione</strong>servono ad assicurare la sicurezza degli animali, la professionalità del lavoro e includere la copertura dei costi per il veterinario. Le spese per il veterinario sono intorno ai 1000-3000 euro per qualsiasi sfortunato evento o incidente che dovesse capitare al tuo animale durante i servizi di cura.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>Richiedere il pagamento in contanti al di fuori della piattaforma di modo da richiedere un prezzo più basso</strong> senza informarvi dei pacchetti offerti da PetBacker (ad esempio free taxi voucher per animali, 10% di sconto ogni 5 prenotazioni etc).
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-05-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-06-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>Richiedere di cancellare la prenotazione sulla piattaforma e prenotare dal vivo</strong>in questo modo possono ottenere i soldi direttamente da te senza utilizzare la piattaforma Inoltre non sarà in grado di richiedere indietro il vostro denaro se il lavoro non è soddisfacente
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>Richiedere ai proprietari degli animali di rivedere la propria prenotazione</strong> da molteplici giorni/visite/passeggiate ad una di modo da poter provare i servizi e prenotarli direttamente successivamente senza informare le persone di tutti i benefici offerti da PetBacker (assicurazione, programmi di qualità e professionalità del servizio).
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-07-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
    </div>
    <div v-else-if="$i18n.locale == 'jajp'">
      <div style="text-align:center;">
        <img
          style="max-width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewartop.png"
        />
      </div>
      <div id="stripes">
        <p
          style="text-align:center; font-family:'Arial Black', Gadget, sans-serif; font-size:18px; padding:10px; color:white;"
        >してはいけないこと</p>
      </div>
      <p
        style="text-align:center; padding:10px;"
      >適正な見積もりを担保し、ペットバッカーさん達を価格競争に巻き込まずPetBackerのコミュニティーを活性化するために、下記の行為が確認されたバッカーさんには仕事の紹介数に制限がかけられます。</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewarno9.png"
            />
          </td>
          <td>
            <p>プラットフォーム外での現金支払いの要求</p>
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <p>プラットフォーム外で支払いの一部を顧客に要求する</p>
          </td>
          <td style="float: right;">
            <img
              style="-webkit-user-select: none;"
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewarno10.png"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewarno1.png"
            />
          </td>
          <td>
            <p>複数回数、日数、訪問数などの予約内容を1回に変えるように要求したり、延長しないようにお願いする場合</p>
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <p>他社プラットフォームの推進</p>
            <p>支払いの前にPetbacker以外のソーシャルメディア等で連絡をするようにリクエストする場合</p>
          </td>
          <td style="float: right;">
            <img
              style="-webkit-user-select: none;"
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewarno3.png"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewarno4.png"
            />
          </td>
          <td>
            <p>PetBacker上で予約し、支払いをする前に連絡先を交換したり、実際に会うこと（そのような行為が発見された場合はそのジョブの契約を継続する場合、手数料の40％をペナルティーとして課す）</p>
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <p>顧客にありえないほど低料金を提示したりデポジットとして割引をしたりする (e.g. USD$1 for a Booking to get contact or to deal outside)</p>
          </td>
          <td style="float: right;">
            <img
              style="-webkit-user-select: none;"
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewarno5.png"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              style="-webkit-user-select: none;"
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewarno67.png"
            />
          </td>
          <td>
            <p>キャンセルまたは正当な理由なく予約をキャンセルする</p>
            <p>PetBacker外でサービスの延長や代替サービスを予約する</p>
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <p>PetBacker外であなたと取引することを期待して、PetBackerの手数料にはペット保険が含まれていることを伝えずにPetBackerは割高だというような間違った印象を与える</p>
          </td>
          <td style="float: right;">
            <img
              style="-webkit-user-select: none;"
              src="https://storage.googleapis.com/petbacker/images/cms/icons/app-pricewarno8.png"
            />
          </td>
        </tr>
      </table>
      <div style="background-color:#917fac">
        <p style="text-align:center; padding:10px; color:#fff;">
          何かサポートが必要であったり、問題に直面した際にはお知らせください。
          <br />P/S顧客がまだあなたを予約していない場合,顧客にあなたを予約してもらえば.あなたのアカウントの制限が解除されます。
        </p>
      </div>
    </div>
    <div v-else-if="$i18n.locale == 'sksk'">
      <div style="text-align:center;">
        <img
          style="width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam-Alert-1.jpg"
        />
      </div>
      <!--BENEFITS-->
      <div style="text-align:center;">
        <img
          style="width:50%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-15.jpg"
        />
      </div>
      <p
        style="font-weight: 600; padding: 15px; text-align: center;"
      >Tu sú niektoré z výhod, ktoré môže využívať pri platbe tvojich rezervácií cez PetBacker:</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-08-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Tvoje peniaze aj zvieratko sú v bezpečí, nakoľko peniaze vyplácame 2-7 dní po tom čo opatrovateľ odviedol prácu uspokojivo.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>Získaj kredity na zľavu pre tvoju ďalšiu rezerváciu.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-09-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-10-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Maj záznamy o všetkých transakciách a možnosť ohodnotiť opatrovateľa.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>Zarezervuj si opatrovateľa v predstihu, aby vedel/a, že máš seriózny záujem. Rezervačné poplatky budú vrátené v prípade, že opatrovateľ nemôže vykonať prácu.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-11-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-12-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>Tvoj opatrovateľ dokáže nahrať trasu prechádzky do Live GPS mapy a taktiež aj vzdialenosť, ktorú prešiel/la.</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>Tvoje zvieratko bude chránený poistením, ako je napríklad zdravotné poistenie.</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-13-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <!--SCAMMING BEHAVIOURS TO LOOK OUT-->
      <div style="text-align:center;">
        <img
          style="width:100%; padding: 20 0 20 0;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-14.jpg"
        />
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-04-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>Zavádzanie, že PetBacker účtuje poplatky bez informovania.</strong> Sú to poplatky pre zabezpečenie bezpečnosti tvojich domácich miláčikov, kvalitu práce a zahŕňajú taktiež poistenie veterinárnych poplatkov. Veterinárne poplatky sa môžu ľahko okolo $1000-$3000 pre všetky nešťastnej udalosti alebo nehody, ktoré sa vyskytujú počas starostlivosti o vášho miláčika.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>Žiadosť o platbu v hotovosti mimo platformy</strong> s prísľubom nižšej ceny alebo zľavy bez informovania o našom programe odmien, kde môžeš získať napr. poukážku na prevoz zvieraťa zdarma, zľavový kupón, tovar zdarma alebo 10% zľavu na každú piatu rezerváciu.
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-05-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-06-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>Žiadosť o zrušenie rezervácie</strong> s prísľubom o vykonaní práce, s cieľom získať peniaze vopred. Neriskuj, bezpečnosť a zdravie svojho psa a neukráť sa o možnosť nechať transparentné hodnotenie v prípade, že opatrovateľ vykonal zlú prácu. Taktiež nebudeš mať nárok na vrátenie peňazí v prípade, že práca bola neuspokojivá.
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>Žiadať o zrevidovanie tvojej rezervácie</strong> z viacerých dní/návštev/prechádzok na jednu pre vyskúšanie služieb, ďalej rezervovať priamo a neinformovať o výhodách, ktoré môžeš získať pri rezervácii cez nás, ako napr. poistenie, program odmien alebo garancia kvality servisu.
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-07-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
    </div>
    <div v-else-if="$i18n.locale == 'zhtw' || $i18n.locale == 'zhhk'">
      <div style="text-align:center;">
        <img
          style="width:100%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert-18.jpg"
        />
      </div>
      <!--BENEFITS-->
      <div style="text-align:center;">
        <img
          style="width:50%;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert-23.jpg"
        />
      </div>
      <p style="font-weight: 600; padding: 15px; text-align: center;">以下是您通過PetBacker預訂時享受的一些好處：</p>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-08-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>您的付款以及您的寵物收到保障，因為我們只會在工作完成後的2到7天内撥款給保姆。</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>獲取下次預訂的折扣。</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-09-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-10-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>記錄所有交易，並能給予保姆評論。</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>提前預訂保姆，以便保姆知道您是認真的。如果保姆無法完成工作，將全額退款。</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-11-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-12-1.png"
              width="120"
              height="120"
            />
          </td>
          <td>
            <p>您的寵物將受到保險的保護，例如醫療保險。</p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>您可以讓寵物保姆在實時GPS地圖上記錄您寵物的步行路線，便便和尿尿的位置以及步行之距離。</p>
          </td>
          <td style="float: right;">
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-13-1.png"
              width="120"
              height="120"
            />
          </td>
        </tr>
      </table>
      <!--SCAMMING BEHAVIOURS TO LOOK OUT-->
      <div style="text-align:center;">
        <img
          style="width:100%; padding: 20 0 20 0;"
          src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert-22.jpg"
        />
      </div>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-04-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>沒有告訴您透過</strong> PetBacker 付款將得到免費的保險，並在工作結束之後才會將款項撥給保姆以保證他們的服務品質。有意誤導您有關 PetBacker 對保姆所收取的服務費，忘了提醒您的寵物需要保險，如果在服務期間發生的任何不幸事件，醫療費將可能達到 $1000-$3000 美元左右。
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>請求在平台外支付現金，</strong> 沒有通知您有關您可能錯過的PetBacker 獎勵計劃（例如，免費寵物出租車券，美容券，折扣券，每5次預訂可享9折優惠或免費商品），假意向您提供更便宜的價格以跳過平台來避免績效考核和評論管理。
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-05-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-06-1.png"
              width="100"
              height="100"
            />
          </td>
          <td>
            <p>
              <strong>要求您取消平台訂單，</strong> 以便他們可以從您那裡獲取現金，或因為他們知道無法提供好的服務，不希望您留下評論。在平台以外交易，若服務令您不滿意，您也無法要求退款。
            </p>
          </td>
        </tr>
      </table>
      <table style="background-color:#FDF8FF;">
        <tr>
          <td>
            <p>
              <strong>要求您（寵物父母）修改您的預訂，</strong> 從多天/多次訪問/多次步行更改到一次，以測試他們的服務並在之後直接繳交現金。他們將不會通知您，您將錯過免費的保險，獎勵計劃和服務質量之保證。
            </p>
          </td>
          <td>
            <img
              src="https://storage.googleapis.com/petbacker/images/cms/icons/Scam Alert b-07-1.png"
              width="100"
              height="100"
            />
          </td>
        </tr>
      </table>
    </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  props: {
    trigger: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      modal: false
    }
  },
  watch: {
    trigger (value) {
      this.modal = value
      this.$emit('on-close', value)
    }
  },
  methods: {
    onClose () {
      this.$emit('on-close', false)
    }
  }
}
</script>
<style lang="stylus">
.benefits-title
  margin-left: 12%

@media screen and (min-width: 320px)
  .benefits-title
    margin-left: 27%

@media screen and (min-width: 350px)
  .benefits-title
    margin-left: 30%

@media screen and (min-width: 370px)
  .benefits-title
    margin-left: 31%

@media screen and (min-width: 400px)
  .benefits-title
    margin-left: 34%

@media screen and (min-width: 530px)
  .benefits-title
    margin-left: 30%
</style>
