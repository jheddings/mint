//=============================================================================
// Copyright © Jason Heddings, All Rights Reserved
// $Id: txn-formatting.user.js 1 2011-02-05 16:58:05Z jheddings $
//=============================================================================

// ==UserScript==
// @name           Mint - Conditional Transaction Formatting
// @version        0.1
// @description    Formats transactions in Mint based on user-defined rules.
// @namespace      jah.mint
// @license        http://creativecommons.org/licenses/BSD/
// @include        https://wwws.mint.com/transaction.event*
// @require        jah-debug.js
// ==/UserScript==

// Version Compatibility: tested with Mint version 11

// Future Improvements:
// * create a UI to store preferences using GM_setValue
// * link gTxnList to data shown on transaction page

// Known Issues:
// * rules are only applied on initial page load
// * style does not apply to selected row

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var gTxnRules = [
  {
    cond: '((txn.tags) && (txn.tags.indexOf("Accepted") < 0))',
    style: 'font-weight: bold'
  },

  {
    cond: '((txn.tags) && (txn.tags.indexOf("Paid") > 0))',
    style: 'text-decoration: line-through'
  },

  {
    cond: '((txn.tags) && (txn.tags.indexOf("Urgent") > 0))',
    style: 'color: red'
  },
];

var gTxnTable = document.getElementById('transaction-list-body');

var gTxnList = null;  // instance of $MW.TxnList
var gTxnListRetry = 5;  // number of times to retry

if (gTxnTable == null) {
  error('could not find transaction table');
  return;
}

//////////////////////////////////////////////////////////////////////////////////
function loadTransactions() {
  GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://wwws.mint.com/app/getJsonData.xevent?task=transactions',
    onload: function(resp) {
      // FIXME we should verify the response meets our expectations
      var data = eval('(' + resp.responseText + ')')['set'][0]['data'];
      debug.log('load transactions: ' + data.length);

      var txns = [ ];
      for (var idx = 0; idx < data.length; idx++) {
        var orig = data[idx];

        var txn = {
          id: orig.id,
          description: orig.merchant,
          memo: orig.note,
          category: orig.category,
          tags: [ ],
        };

        var amt = orig.amount.replace(/[$,]/g, '');
        txn.amount = parseFloat(amt);
        if (orig.isDebit) { txn.amount *= -1; }

        if ((orig.labels) && (orig.labels.length > 0)) {
          for (var jdx = 0; jdx < orig.labels.length; jdx++) {
            txn.tags[jdx] = orig.labels[jdx].name;
          }
        }

        // TODO parse date

        txns[idx] = txn;
      }

      gTxnList = txns;
    }
  });
}

//////////////////////////////////////////////////////////////////////////////////
function addEditButton() {
  var bttn = document.createElement('a');
  bttn.className = 'button';
  bttn.title = 'Edit custom formatting rules';
  bttn.innerHTML = 'Formatting Rules...';
  bttn.addEventListener('click', displayRulesDlg, true);

  document.getElementById('controls-top').appendChild(bttn);
}

//////////////////////////////////////////////////////////////////////////////////
function writeCustomStyles() {
  var style = document.createElement('style');

  for (var idx = 0; idx < gTxnRules.length; idx++) {
    var cname = 'jah_mint_txn_' + idx;

    style.innerHTML += '.' + cname + ' * { ';
    style.innerHTML += gTxnRules[idx].style;
    style.innerHTML += ' }\n';

    gTxnRules[idx].cname = cname;
  }

  document.getElementsByTagName('head')[0].appendChild(style);
}

//////////////////////////////////////////////////////////////////////////////////
function clearCustomFormatting() {
  var rows = gTxnTable.children;

  for (var idx = 0; idx < rows.length; idx++) {
    rows[idx].className = rows[idx].className.replace(/\s*jah_mint_txn_\d+/g, '');
  }
}

//////////////////////////////////////////////////////////////////////////////////
function beginFormatting() {
  // wait for txn list to finish loading
  if (gTxnList == null) {
    if ((--gTxnListRetry) >= 0) {
      setTimeout(beginFormatting, 500);
    } else {
      debug.error('could not load txn list, giving up');
    }
    return;
  }

  applyFormattingRules();
  monitorListForChanges();
}

//////////////////////////////////////////////////////////////////////////////////
function applyFormattingRules() {
  debug.log('apply formatting rules');

  clearCustomFormatting();

  for (var idx = 0; idx < gTxnList.length; idx++) {
    var txn = gTxnList[idx];

    for (var jdx = 0; jdx < gTxnRules.length; jdx++) {
      var rule = gTxnRules[jdx];
      applyConditionalFmt(rule, txn);
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////
function applyConditionalFmt(rule, txn) {
  if (matchCondition(rule.cond, txn)) {
    var elem = document.getElementById('transaction-' + txn.id);
    if (elem == null) {
      debug.warn('could not apply format to txn: ' + txn.id);
    } else {
      elem.className += ' ' + rule.cname;
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////
function monitorListForChanges() {
  // gTxnList.when-it-is-updated = applyFormattingRules();
}

//////////////////////////////////////////////////////////////////////////////////
function matchCondition(cond, txn) {
  // FIXME this is a nasty hack
  return eval('(' + cond + ')');
}

//////////////////////////////////////////////////////////////////////////////////
function displayRulesDlg() {
}

//////////////////////////////////////////////////////////////////////////////////
// MAIN ENTRY POINT
debug.enabled = true;
debug.prefix = 'condfmt';

debug.info('Version: 0.1 / Mint: ' + unsafeWindow.Mint.VERSION);

loadTransactions();
writeCustomStyles();
//addEditButton();
beginFormatting();
