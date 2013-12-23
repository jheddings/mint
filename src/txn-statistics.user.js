//=============================================================================
// Copyright © Jason Heddings, All Rights Reserved
// $Id: txn-statistics.user.js 1 2011-02-05 16:58:05Z jheddings $
//=============================================================================

// ==UserScript==
// @name           Mint - Transaction Stats
// @namespace      jah.mint
// @description    Provides statistics for transactions when multiple are selected.
// @include        https://wwws.mint.com/transaction.event*
// @version        0.0
// ==/UserScript==

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

// method call when item is selected:
// - getItems()

////////////////////////////////////////////////////////////////////////////////
function _create_stats_elements() {
  var statsTitleElem = document.createElement('h4');
  statsTitleElem.setAttribute('id', 'txn-detail-stats-title');
  statsTitleElem.appendChild(document.createTextNode('Statistics'));

  var statsElem = document.createElement('dl');
  statsElem.setAttribute('id', 'txn-detail-stats');

  var statCountTitleElem = document.createElement('dt');
  statCountTitleElem.setAttribute('id', 'txn-stats-count-title');
  statCountTitleElem.appendChild(document.createTextNode('Count:'));
  statsElem.appendChild(statCountTitleElem);

  var statCountElem = document.createElement('dd');
  statCountElem.setAttribute('id', 'txn-stats-count');
  statsElem.appendChild(statCountElem);

  var statSumTitleElem = document.createElement('dt');
  statSumTitleElem.setAttribute('id', 'txn-stats-sum-title');
  statSumTitleElem.appendChild(document.createTextNode('Sum:'));
  //statsElem.appendChild(statSumTitleElem);

  var statSumElem = document.createElement('dd');
  statSumElem.setAttribute('id', 'txn-stats-sum');
  statsElem.appendChild(statSumElem);

  // insert both new stats elements into detail column
  var elem = document.getElementById('txn-detail-details');
  elem.parentNode.insertBefore(statsElem, elem.nextSibling);
  elem.parentNode.insertBefore(statsTitleElem, statsElem);
}

////////////////////////////////////////////////////////////////////////////////
// SCRIPT ENTRY
_create_stats_elements();
