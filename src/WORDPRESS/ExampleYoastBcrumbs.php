<? if(!is_front_page() && !is_singular( 'post' )): ?>
	<section class="breadcrumbs__section">
		<div class="breadcrumbs__container container">
			<div class="breadcrumbs__title-container">
				<? if(get_the_title() == 'Сбис партнер'): ?>
					<img class="breadcrumbs__title-icon" src="<?=get_template_directory_uri()?>/images/additional/cbic.svg" alt="">
				<? endif; ?>
				<h1 class="breadcrumbs__title text_bold"><?echo is_category() ? single_cat_title('', false) : single_post_title('', false);?></h1>
			</div>
			<span class="breadcrumbs__path"><? yoast_breadcrumb(); ?></span>
		</div>
	</section>
<? elseif(is_single()|| is_category()): ?>
	<section class="breadcrumbs__section">
		<div class="breadcrumbs__container_vert container">
			<h1 class="breadcrumbs__title text_bold"><? single_post_title();?></h1>
			<span class="breadcrumbs__path"><? yoast_breadcrumb(); ?></span>
		</div>
	</section>
<? endif; ?>