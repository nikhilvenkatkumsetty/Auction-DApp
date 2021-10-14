App = {
    
    loading:false,
    var : bidWinArray = [],
    var : bidWinCountP=0,
    var : flagger=0,
    render: async () => {
        if(App.loading) {
            return;
        }
        $('#account').html(App.account);
        await App.listAllBidWins();
        await App.listMyTenders();
        await App.listAllBids();
        
    },

    listMyTenders: async () => {
        const tenderCount = await App.TenderAuction.tenderCount();
        for(i = 1; i <= tenderCount; i++) {
            const tender = await App.TenderAuction.tenders(i);
            if(tender[4] == App.account){
                var TenderStatus = "Open";
                if(bidWinCountP!=0){
                    var flag =0;
                    for(ii=1;ii<=bidWinCountP;ii++){
                        var a =String(tender[0]);
                        var aa=String(bidWinArray[ii-1][1]);
                        var b=String(tender[4]);
                        var bb=String(bidWinArray[ii-1][5]);
                    if(a==aa&&b==bb)
                        flag=1;
                    }
                    if(flag==1)
                    {
                        TenderStatus="Closed";
                    }
                }
                const tenderTemplate = `<tr style="text-align:center">
                                            <td>${tender[0]}</td>
                                            <td>${tender[1]}</td>
                                            <td>${tender[2]}</td>
                                            <td>${tender[3]}</td>
                                            <td>${TenderStatus}</td>
                                        </tr>`;
                $("#mytenders").append(tenderTemplate);
            }
        }
    },


    listAllBids: async () => {
        const bidCount = await App.TenderAuction.bidCount();
        for(i = 1;i <= bidCount; i++)
        {
            const bid = await App.TenderAuction.bids(i);    
            if(bid[5] == App.account){
                var bidStatus = "Accept";
                var flag2=0;
                if(bidWinCountP!=0){
                    for(jj=1;jj<=bidWinCountP;jj++)
                    {
                        var a=String(bid[0]);
                        var b=String(bid[1]);
                        var aa=String(bidWinArray[jj-1][0]);
                        var bb=String(bidWinArray[jj-1][1]);
                        if((a==aa)&&(b==bb)&&bidWinArray[jj-1][5]==App.account){
                            flag2=1;//accepted
                            
                        }
                        if(flag2==0&&a!=aa&&b==bb&&bidWinArray[jj-1][5]==App.account){
                            flag2=2;//declined

                        }
                    }
                    if(flag2==1)
                    bidStatus="Accepted";
                    if(flag2==2)
                    bidStatus="Declined";
                }
                if(flag2==0){
                const bidsTemplate = `<tr style="text-align:center">
                                        <td>${bid[0]}</td>
                                        <td>${bid[1]}</td>
                                        <td>${bid[2]}</td>
                                        <td>${bid[3]}</td>
                                        <td>${bid[4]}</td>
                                        <td><button onclick="App.acceptedBid(${bid[0]});" class="btn btn-info">${bidStatus}</button></td>
                                    </tr>`;
                                    $("#allBidsTable").append(bidsTemplate);
                }

                if(flag2==1){
                const bidsTemplate = `<tr style="text-align:center">
                                        <td>${bid[0]}</td>
                                        <td>${bid[1]}</td>
                                        <td>${bid[2]}</td>
                                        <td>${bid[3]}</td>
                                        <td>${bid[4]}</td>
                                        <td><button onclick="" class="btn btn-success">${bidStatus}</button></td>
                                    </tr>`;
                                    $("#allBidsTable").append(bidsTemplate);
                }

                if(flag2==2){
                const bidsTemplate = `<tr style="text-align:center">
                                        <td>${bid[0]}</td>
                                        <td>${bid[1]}</td>
                                        <td>${bid[2]}</td>
                                        <td>${bid[3]}</td>
                                        <td>${bid[4]}</td>
                                        <td><button onclick="" class="btn btn-danger" id="apna">${bidStatus}</button></td>
                                    </tr>`;
                                    $("#allBidsTable").append(bidsTemplate);
                        }
                
            }
        }
    },

    acceptedBid: async(bidNumber) =>{
        App.setLoading(true);
        const winningBid = await App.TenderAuction.bids(bidNumber);
        try{
            await App.TenderAuction.addBidWin(winningBid[0],winningBid[1],winningBid[2],winningBid[3],winningBid[4],winningBid[5],{from:App.account});
            window.location.reload();
        }catch{
            window.location.reload();
        }

    },

    listAllBidWins: async()=>{
        const bidWinCount= await App.TenderAuction.bidWinCount();
        bidWinCountP = bidWinCount;
        for(i = 1; i <= bidWinCount; i++ ){
            const BidAccepted = await App.TenderAuction.bidWins(i);
            bidWinArray.push(BidAccepted);
        }
    },

    submitTender: async () => {
        App.setLoading(true);
        const itemName = $("#itemName").val();
        const itemDesc = $("#itemDesc").val();
        const itemQuantity = $("#itemQuantity").val();

        try{
            await App.TenderAuction.createTender(itemName, itemDesc, itemQuantity, {from:App.account});
            window.location.reload();
        }catch{
            window.location.reload();
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
    },

}

function uploadTenders() {
    $("#tenderList").hide();
    $("#uploadTender").show();
    $("#allBids").hide();
}

function showTenders() {
    $("#tenderList").show();
    $("#uploadTender").hide();
    $("#allBids").hide();
}

function showBids(){
    $("#tenderList").hide();
    $("#uploadTender").hide();
    $("#allBids").show();
}
