App = {
    
    loading:false,
    var : bidWinArray = [],
    var : bidWinCountP=0,

    render: async () => {
        if(App.loading) {
            return;
        }
        $('#account').html(App.account);
        await App.listAllBidWins();
        await App.listAllTenders();
        await App.listMyBids();
    },

    listAllTenders: async () => {
        const tenderCount = await App.TenderAuction.tenderCount();
        for(i = 1; i <= tenderCount; i++) {
            const tender = await App.TenderAuction.tenders(i);
            var CanBidStatus="Bid";
            var TenderStatus = 0;
            if(bidWinCountP!=0)
            {
                for(ij=1;ij<=bidWinCountP;ij++)
                {
                    var a=String(tender[0]);
                    var aa=String(bidWinArray[ij-1][1]);
                    var b=String(tender[4]);
                    var bb=String(bidWinArray[ij-1][5]);
                    if(a==aa&&b==bb){
                        TenderStatus=1;
                    }
                }
                if(TenderStatus==1)
                {
                    CanBidStatus="Tender Closed";
                }
            }
            if(TenderStatus==0){
            const tenderTemplate = `<tr style="text-align:center">
                                        <td>${tender[0]}</td>
                                        <td>${tender[1]}</td>
                                        <td>${tender[2]}</td>
                                        <td>${tender[3]}</td>
                                        <td>${tender[4]}</td>
                                        <td><button onclick="popup('${tender[0]}')" class="btn btn-success">${CanBidStatus}</button></td>
                                    <tr>`;
                                    $("#allTenders").append(tenderTemplate);
            }
            if(TenderStatus==1){
            const tenderTemplate = `<tr style="text-align:center">
                                        <td>${tender[0]}</td>
                                        <td>${tender[1]}</td>
                                        <td>${tender[2]}</td>
                                        <td>${tender[3]}</td>
                                        <td>${tender[4]}</td>
                                        <td><button onclick="" class="btn btn-info">${CanBidStatus}</button></td>
                                    <tr>`;
                                    $("#allTenders").append(tenderTemplate);
            }
            const tenderPopupTemplate = `<div class="abc" id="tenderId${tender[0]}">
			
                                            <br><br><br>

                                            <span onclick="div_hide('${tender[0]}')" style="float:right" class="x">X</span>

                                            <div style="margin-top:20px; width: 550px;" class="container card w3-section">
                                            
                                                <span><b>Tender ID: </b>${tender[0]}</span>
                                                <span><b>Tender Name: </b>${tender[1]}</span>
                                                <span><b>Quantity: </b>${tender[3]}</span>
                                                <span><b>Uploader Address: </b>${tender[4]}</span>

                                                <hr>

                                                <center style="margin-bottom:10px;">
                                                    <input class="form-control" type="number" style="margin-bottom:10px;" id="ppi${tender[0]}" placeholder="Price per Item">
                                                    <button class="w3-button w3-green" style="width:150px;" onclick="App.makeBid(${tender[0]});">Make a Bid</button>
                                                </center>

                                            </div>
                                            
                                        </div>`

            $("#tenderPopup").append(tenderPopupTemplate);     
                 
        }
    },

    listMyBids: async () => {
        const bidCount = await App.TenderAuction.bidCount();
        for(i = 1; i <= bidCount; i++) {
            const bid = await App.TenderAuction.bids(i);
            if(bid[4] == App.account) {
                var bidStatus = "Outcome Pending";
                var bidStatusind=0;
                if(bidWinCountP!=0)
                {
                    for(ik=1;ik<=bidWinCountP;ik++)
                    {
                        var a=String(bid[1]);
                        var aa=String(bidWinArray[ik-1][1]);
                        var b=String(bid[4]);
                        var bb=String(bidWinArray[ik-1][4]);
                        var c=String(bid[0]);
                        var cc=String(bidWinArray[ik-1][0]);
                        if(a==aa&&b==bb&&c==cc)
                        {
                            bidStatusind=1;
                        }
                        else if(a==aa&&b!=bb||a==aa&&b==bb&&c!=cc)
                        {
                            bidStatusind=2;
                        }
                    }
                    if(bidStatusind==1)
                    {
                        bidStatus="Won";
                    }
                    if(bidStatusind==2)
                    {
                        bidStatus="Lost";
                    }
                }
                if(bidStatusind==0){
                const bidTemplate = `<tr style="text-align:center">
                                            <td>${bid[0]}</td>
                                            <td>${bid[2]}</td>
                                            <td>${bid[3]}</td>
                                            <td><button class="btn btn-info">${bidStatus}</button></td>
                                        </tr>`;
                $("#myBids").append(bidTemplate);
                }
                if(bidStatusind==1){
                const bidTemplate = `<tr style="text-align:center">
                                            <td>${bid[0]}</td>
                                            <td>${bid[2]}</td>
                                            <td>${bid[3]}</td>
                                            <td><button class="btn btn-success">${bidStatus}</button></td>
                                        </tr>`;
                $("#myBids").append(bidTemplate);
                }
                if(bidStatusind==2){
                const bidTemplate = `<tr style="text-align:center">
                                            <td>${bid[0]}</td>
                                            <td>${bid[2]}</td>
                                            <td>${bid[3]}</td>
                                            <td><button class="btn btn-danger">${bidStatus}</button></td>
                                        </tr>`;
                $("#myBids").append(bidTemplate);
                }
            }
        }
    },

    makeBid: async (id) => {
        App.setLoading(true);
        const bid = $("#ppi"+id).val();
        App.TenderAuction.createBid(id, bid, {from:App.account});
    },

    listAllBidWins: async()=>{
        const bidWinCount= await App.TenderAuction.bidWinCount();
        bidWinCountP = bidWinCount;
        for(i = 1; i <= bidWinCount; i++ ){
            const BidAccepted = await App.TenderAuction.bidWins(i);
            bidWinArray.push(BidAccepted);
        }
    },

    setLoading: (boolean) => {
        App.loading = boolean;
        const loader = $('#loading');
        const content = $('#content');
        if(boolean) {
            loader.show();
            content.hide();
        }else {
            loader.hide();
            content.show();
        }
    }

}

function showAllTenders() {
    $("#bidList").hide();
    $("#listAllTenders").show();
}

function showBids() {
    $("#bidList").show();
    $("#listAllTenders").hide();
}

function popup(id) {
    $("#tenderId"+id).show();
}

function div_hide(id) {
    $("#tenderId"+id).hide();
}