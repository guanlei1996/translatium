﻿!function(){"use strict";var n=WinJS.Navigation,i=(WinJS.Utilities,WinJS.Binding);WinJS.UI;WinJS.UI.Pages.define("/pages/about/about.html",{ready:function(a,t){Windows.ApplicationModel.Package.current.id.version;this.bindingData=WinJS.Binding.as({appVersion:"3.9.14",poweredBy:WinJS.Resources.getString("powered_by").value.replace("{1}",'<a href="http://translate.google.com">Google</a> & <a href="http://bing.com/translator">Bing</a>'),onclickBack:i.initializer(function(){n.back()}),onclickContact:i.initializer(function(){var n=new Windows.Foundation.Uri("mailto:support@modernlab.xyz");return Windows.System.Launcher.launchUriAsync(n)}),onclickWebsite:i.initializer(function(){var n=new Windows.Foundation.Uri("http://moderntranslator.com");return Windows.System.Launcher.launchUriAsync(n)})});var e="",o=Custom.Data.languageList.length,r=0;Custom.Data.languageList.forEach(function(n){return"auto"==n.language_id||0==n.main?void o--:(r++,void(e+=n.language_name+", "))}),e=e.substring(0,e.length-2)+".",this.bindingData.languageList=e,this.bindingData.feature_new_1=WinJS.Resources.getString("feature_new_1").value.replace("{1}",o),i.processAll(a,this.bindingData)},unload:function(){}})}();