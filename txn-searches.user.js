//=============================================================================
// Copyright © Jason Heddings, All Rights Reserved
// $Id: txn-searches.user.js 1 2011-02-05 16:58:05Z jheddings $
//=============================================================================

// ==UserScript==
// @name           Mint - Saved Searches
// @version        0.1
// @description    Allows a user to save searches and execute them from the transaction list.
// @namespace      jah.mint
// @license        http://creativecommons.org/licenses/BSD/
// @include        https://wwws.mint.com/transaction.event*
// @require        jah-debug.js
// ==/UserScript==

// Version Compatibility: tested with Mint version 11

// Future Improvements:
// * store searches in chrome instead of hard-coded here
// * add a button to save a search
// * allow user to choose location for search box

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

var gInsertBefore = 'localnav-acounts';

var gSearchListElem = undefined;

var gSearches = [
  {
    name: 'Unaccepted',
    query: '-tag:Accepted'
  },
];

//debug.enabled = true;

////////////////////////////////////////////////////////////////////////////////
function _update_search_box() {
  // TODO clear list elements first

  for (var idx = 0; idx < gSearches.length; idx++) {
    var search = gSearches[idx];

    var href = 'transaction.event?query=' + escape(search.query);

    var link = document.createElement('a');
    link.setAttribute('href', href);
    link.appendChild(document.createTextNode(search.name));

    var item = document.createElement('li');
    item.setAttribute('id', 'search-' + idx);
    item.setAttribute('title', search.name);
    item.appendChild(link);

    gSearchListElem.appendChild(item);
  }
}

////////////////////////////////////////////////////////////////////////////////
function _create_search_box() {
  var searchNavBoxElem = document.createElement('li');
  searchNavBoxElem.setAttribute('id', 'localnav-saved-search');

  var titleElem = document.createElement('h5');
  titleElem.appendChild(document.createTextNode('Searches'));
  searchNavBoxElem.appendChild(titleElem);

  gSearchListElem = document.createElement('ol');
  searchNavBoxElem.appendChild(gSearchListElem);

  // TODO insert search box at desired location in localnav
  //var navElem = document.getElementById('localnav');

  // XXX this is kind of a hack...
  var insertPoint = document.getElementById(gInsertBefore);
  insertPoint.parentNode.insertBefore(searchNavBoxElem, insertPoint);
}

////////////////////////////////////////////////////////////////////////////////
// SCRIPT ENTRY
// ?? debug.entry();

_create_search_box();
_update_search_box();

// ?? debug.exit();
