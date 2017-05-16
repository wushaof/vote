$(function(){
  var n=1,m;
  var myScroll=new IScroll('#home_scroll',{
    mouseWheel: true,
    scrollbars: true,
    interactiveScrollbars:true,
    preventDefault:false,
    tap:true
  });
  function addBook(n){
    if(n>=m){
      return
    }
    $.ajax({
      url:"http://test.joywithyou.com/api/v1/book/?page="+n,
      success:function(res){
        var book=res.results.data,
            $box=$("#box"),
            len=book.length;
            m=Math.ceil(res.count/10)+1;
        for(var i=0;i<len;i++){
          var $div=$("<div class='col-xs-6 col-md-3 col-sm-4'>"+
                        "<div class='book'>"+
                            "<img src="+book[i].book_image+" />"+
                            "<div class='book-title'>"+book[i].book_name+"</div>"+
                            "<div class='book-intro'>"+book[i].book_author+"</div>"+
                            "<div class='book-intro'>"+book[i].book_introduce+"</div>"+
                            "<div class='book-checkbox'>"+
                              "<input type='checkbox' id='radio-"+book[i].id+"' class='regular-checkbox big-checkbox'>"+
                              "<label class='cli_class' for='radio-"+book[i].id+"' id='"+book[i].id+"'>"+
                              "</label>"+
                            "</div>"+
                          "</div>"+
                        "</div>");
                $div.appendTo($box);

        };

        setTimeout(function(){
          myScroll.refresh()
        },0);

      }
    })
  };
  addBook(n);

  setTimeout(function(){
    var $label=$('#box'),
        arr=[],
        $book_id,
        $cli_class=$('.cli_class'),
        onOff=true,
        len=$cli_class.length;
        for(var i=0;i<len;i++){
          $cli_class[i].onOff=true;
        };
        document.onclick=function(){
          if(!onOff){
            return false
          };
        };
        $label.on('click','.cli_class',function(){
          if(!onOff){
            return
          };
          var $id=$(this).attr('id');
          if($(this).context.onOff==false){
            arr.forEach(function(res,index){
              if(res.indexOf($id)!=-1){
                arr.splice(index,1)
              }
            });
            $(this).context.onOff=true;
          }else{
            $book_id=$(this).attr('id');
            arr.push($book_id);
            $(this).context.onOff=false;
          }

        });
        var $btn=$('#myStateButton'),
            $email=$('.email_'),
            $submit=$('#submit'),
            $input_email=$('.input_email');
        $btn.click(function(){
          if(!onOff){
            return
          };
          if(arr.length==0){
            alert('请投票');
            return
          }
          $email.css({'display':'block'})
        });
        $('#home_scroll').click(function(){
          $email.css({'display':'none'})
        });
        $submit.click(function(){
          var val=$input_email.val();
          var reg= /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          if(!reg.test(val)){
            alert('请输入正确的邮箱');
            return
          };
          var data1=JSON.stringify({
            'book_ids':arr,
            'email':val
          });
          $.ajax({
            type:"post",
            url:"http://test.joywithyou.com/api/v1/vote/",
            data:{
              "data":data1
            },
            success:function(res){
              if(res.status=='-1'){
                $email.css({'display':'none'});
                $('.warn_vote').css({'display':'block'});
                setTimeout(function(){
                  $('.warn_vote').css({'display':'none'});
                },2500);
                return
              }
              $email.css({'display':'none'});
              $('.vote_success').css({'display':'block'});
              setTimeout(function(){
                $('.vote_success').css({'display':'none'});
              },2000);
              $('#myStateButton').css({'background':'#9b9b9b'});
              onOff=false;
            }
          })

        })
  },200);

  myScroll.on('scrollEnd',function(){
    if(this.y<=this.maxScrollY){
      n++;
      addBook(n);
    }
  });

  document.addEventListener('touchmove', function (e) {
    e.preventDefault();
  }, false);
})
