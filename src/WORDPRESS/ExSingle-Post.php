<?
get_header();
?>

<div class="post__content container">
	<div class="post__header">
		<img src="<?=get_the_post_thumbnail_url(get_the_ID(), 'full'); ?>" alt="" class="post-image">

		<div class="post-stats">
			<div class="post-stat-wrapper">
				<img src="<?=get_template_directory_uri()?>/images/icons/comment_new.svg" alt="" class="post-stat-ico" uk-svg>
				<span class="post-stat-num"><? comments_number( '0', '1', '%'); ?></span>
			</div>
			<div class="post-stat-wrapper">
				<img src="<?=get_template_directory_uri()?>/images/icons/views_new.svg" alt="" class="post-stat-ico" uk-svg>
				<span class="post-stat-num"><?=wpp_get_views(get_the_ID());?></span>
			</div>
			<div class="post-stat-wrapper">
				<img src="<?=get_template_directory_uri()?>/images/icons/calendar_new.svg" alt="" class="post-stat-ico" uk-svg>
				<span class="post-stat-num"><?=the_time('d.m.Y')?></span>
			</div>
		</div>
	</div>
	
	<? the_content(); ?>
	
	<? include "includes/post-contacts.php"; ?>
</div>

<div class="comments-container">
<?
comments_template( '/comments.php' );
?>
</div>
<?
get_footer();
?>