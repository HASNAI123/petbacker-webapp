/* global bugsnagClient */
import languages from 'assets/languages.json'

export default {
  data () {
    return {
      languageOptions: languages.filter(({active}) => active === true),
      lang_convert: {
        'en': 'en-us',
        'zhtw': 'zh-hans',
        'msmy': 'ms',
        'eses': 'es',
        'jajp': 'ja',
        'dede': 'de',
        'zhcn': 'zh-hans',
        'ptpt': 'pt',
        'nlnl': 'nl',
        'sksk': 'sk',
        'he': 'he',
        'itit': 'it',
        'cscz': 'cs',
        'zhhk': 'zh-hant',
        'frfr': 'fr',
        'thth': 'th',
        'idid': 'id',
        'elel': 'el'
      },
      lang: this.$i18n.locale
    }
  },
  watch: {
    lang (lang) {
      // dynamic import, so loading on demand only
      import(`quasar/lang/${lang}`).then(lang => {
        this.$i18n.locale = lang.default
      })
    }
  },
  created () {
    if (['zh_cn', 'zh_tw', 'zh_hk'].includes(this.$store.state.user.language)) {
      this.$i18n.locale = this.$store.state.user.language.toString().toLowerCase().replace('_', '')
    } else {
      this.$i18n.locale = this.$store.state.user.language
    }
  },
  methods: {
    switchLocale (language, updateUserLangDb) {
      switch (language) {
        case 'zhcn': language = 'zh_cn'; break
        case 'zh_cn': break
        case 'zhtw': language = 'zh_tw'; break
        case 'zh_tw': break
        case 'zhhk': language = 'zh_hk'; break
        case 'zh_hk': break
        case 'de': language = 'dede'; break
        case 'dede': break
        case 'th': language = 'thth'; break
        case 'thth': break
        case 'id': language = 'idid'; break
        case 'idid': break
        case 'fr': language = 'frfr'; break
        case 'frfr': break
        case 'es': language = 'eses'; break
        case 'eses': break
        case 'it': language = 'itit'; break
        case 'itit': break
        case 'sk': language = 'sksk'; break
        case 'sksk': break
        case 'ja': language = 'jajp'; break
        case 'jajp': break
        case 'cs': language = 'cscz'; break
        case 'cscz': break
        case 'ms': language = 'msmy'; break
        case 'msmy': break
        case 'el': language = 'elel'; break
        case 'elel': break
        case 'pt': language = 'ptpt'; break
        case 'ptpt': break
        default: language = 'en'
      }

      let standardizedLanguage = ''
      if (typeof language === 'number') {
        standardizedLanguage = this.$_.findWhere(this.languageOptions, {'id': language}).label || 1
      } else if (language === null) {
        standardizedLanguage = 'en' // fallback to en
      } else {
        standardizedLanguage = language.toString().toLowerCase().replace('-', '_')
      }

      if (!this.languageAllowed(language)) {
        console.log(`Language ${language} is not in allowed languages. Reverting to default language`)
        standardizedLanguage = 'en'
      }

      if (this.$store.getters['user/getCurrentLanguage'] !== standardizedLanguage) {
        this.$store.commit('user/updateUserLanguageState', standardizedLanguage)
      }

      this.$store.commit('user/updateLangChangeState', standardizedLanguage)
      // this.$store.commit('user/updateUserLanguageState', standardizedLanguage)
      // If lang is from query string or domain, only then we
      // call API to save user preferred language
      if (updateUserLangDb) {
        let languageId = this.$_.findWhere(this.languageOptions, {'value': standardizedLanguage}).id
        this.updateUserLanguage(languageId)
      }
      this.$i18n.locale = standardizedLanguage.toString().replace('_', '')
    },
    updateUserLanguage (id) {
      if (!this.$store.state.user.access) return
      let accountInfo = JSON.stringify({
        'accountInfo': {
          'language': id
        }
      })
      this.$axios.put(`account/${this.$store.state.user.uuid}`, accountInfo, {
        headers: {
          'Authorization': this.$store.getters['user/authorizationHeader']
        }
      }).catch((e) => {
        let lang = this.$store.getters['user/getCurrentLanguage']
        bugsnagClient.notify(new Error(e), {
          beforeSend: function (report) {
            report.metaData = {
              accountInfo: {
                language: lang
              }
            }
          }
        })
        console.log(e)
      })
    },
    languageAllowed (language) {
      return this.$_.where(this.languageOptions, {'value': language})
    }
  }
}
