<?
get_header();
?>

<div class="post">
	<div class="post__title">
		<div class="post__title-container container">
			<h1 class="post__title-text">Блог</h1>
		</div>
	</div>

	<div class="post__container container">
		<div class="post__wrapper">
			<?
				include 'includes/post-header.php';
			?>

			<div class="post__content">
				<div class="post__content-wrapper blog__articles-wrapper">
					<div class="blog__articles">
						<?
							$query = new WP_Query( [ 'posts_per_page' => 9, 'post_type' => 'blog', 'orderby' => 'date', 'order' => 'DESC' ] );
							while ($query->have_posts()):
							$query->the_post();
						?>
						<div class="text article-card blog__articles-card">
							<a href="<?=get_the_permalink()?>" class="article-card__img-wrapper">
								<? echo get_the_post_thumbnail(get_the_ID(), 'full', array( 'class' => 'article-card__img')); ?>
							</a>
							<div class="article-card__preview">
								<h3 class="article-card__title">
									<a href="<?=get_the_permalink()?>" class="article-card__link"><?=the_title()?></a>
								</h3>
								<span class="article-card__descr"><?=the_excerpt()?></span>
								<a href="<?=get_the_permalink()?>" class="article-card__more-link">Подробнее</a>
							</div>
							<div class="article-card__meta-container">
								<div class="article-card__meta-wrapper">
									<span class="article-card__meta-date"><?=the_time('d.m.Y')?></span>
								</div>
							</div>
						</div>
						<?
							endwhile;
							wp_reset_postdata();
						?>
					</div>
					<?
					$query = new WP_Query( [ 'post_type' => 'blog', 'posts_per_page' => -1 ] );
					$totalPosts = $query->found_posts;
					?>
					
					<script>
						var currentPage = 1;
						var maxPages = '<?=ceil($totalPosts / 9)?>';
					</script>
					<button type="button" class="btn blog__articles-more-btn">
						Загрузить ещё
					</button>
				</div>
			</div>
			<?
				include 'includes/recall.php';
			?>
		</div>
		<?
			include 'includes/sidebar.php';
		?>
	</div>
</div>
<?
get_footer();
?>