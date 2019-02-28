<?php if(!is_page('finalizar-compra')){
	get_template_part('newsletter');
	}
?>

<footer>
	<?php if(!is_page('finalizar-compra')): ?>
	<div class="container-fluid">		
		<div id="footer-widgets" class="row">
			<div class="container">
				<div class="row">
					<div class="col-md">
                        <h3>Sobre a Ethix</h3>
						<?php dynamic_sidebar( 'footer-1' ) ?>
					</div>
					<div class="col-md">
                        <h3>Empresa</h3>
						<?php dynamic_sidebar( 'footer-2' ) ?>
					</div>
                    <div class="col-md">
                        <h3>Atendimento</h3>
                        <?php dynamic_sidebar( 'footer-3' ) ?>
                    </div>
                    <div class="col-md">
                        <h3>Informações</h3>
                        <?php dynamic_sidebar( 'footer-4' ) ?>
                    </div>
				</div>
			</div>
		</div>
		<a href="#" id="back-to-top" title="Back to top"><i class="fas fa-sort-up icon-back-to-top"></i></a>
	</div>
	<?php endif; ?>

	<div id="footer-copy">
		<div class="col text-center">
			<p>&copy; <?php echo date("Y"); ?> Ethix Nutracêuticos – Todos direitos reservados </p>
		</div>
	</div>
</footer>


<?php wp_footer(); ?>

<script>
jQuery(document).ready(function($) {
	/*////////////////////////////////////////////////
/////// Remove itens do carrinho
///////////////////////*/
    $('.remove-item-cart').click(function(event) {
        event.preventDefault();
        var id = $(this).attr('data-id');
        var url = "<?php echo get_template_directory_uri() ?>/includes/cart_actions.php";

        $.ajax({
            type: "POST",
            url: url,
            data: {id : id},
            success: function (res) {
                var obj = JSON.parse(res);
                console.log(obj.id);
                if(obj.status == 'success'){
                    alert(obj.msg);
                    $(`#item-${obj.id}`).remove();
                    $(`#cartqty`).remove();
                    $('#cart-subtotal').html(obj.subtotal);
                    $('#cart-qty').html(obj.cart_qty);
                    if(obj.cart_qty === 0){
                        $('.empty-cart').show();
                        $('.cart-items').hide();
                    }
                    
                    location.reload();
                }

            }
        });
    });

    $('#toggle-mobile').toggle(function() {
        $('.mobile-collapse').show('800');
        $('#menu-closed').hide();
        $('#menu-opened').show();
    }, function() { 
        $('.mobile-collapse').css({"min-width": "inherit", "transition": "none"});       
        $('.mobile-collapse').hide('800');
        $('#menu-closed').show();
        $('#menu-opened').hide();
    });
    $('.dropdown-toggle').click(function(event) {
        event.preventDefault();
        var menuName = $(this).html();
        $('.dropdown-close a').html(`<div><span>Voltar</span><span style="float:right; padding-right:15px"><b>${menuName}</b></span></div>`);
        $('.mobile-collapse').css({"display": "block", "min-width": "100%", "margin-left": "-110%", "transition": "ease-in-out .6s"});
        $('.dropdown-menu').css({"left": "0", "transition": "ease-in-out .6s"});
    });
    $('.dropdown-close').click(function(event) {
        event.preventDefault();
        $('.dropdown-menu').css({"left": "100%", "transition": "ease-in-out .6s"});
        $('.mobile-collapse').css({"display": "block", "min-width": "100%", "margin-left": "0", "transition": "ease-in-out .6s"});
    });

});

</script>

</body>
</html>