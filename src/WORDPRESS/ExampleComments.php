<?php
if ( post_password_required() )
  return;
?>
 
<?php
function mytheme_comment($comment, $args, $depth) {
  $GLOBALS['comment'] = $comment; ?>
  <div <?php comment_class(); ?> id="li-comment-<?php comment_ID() ?>">
    <div id="comment-<?php comment_ID(); ?>" class="comment__container">
 
      <div class="comment-author vcard">
        <span class="comment-author__name"><?php echo get_comment_author_link() ?></span>
        <span class="comment-meta commentmetadata comment-author__date">
			<img src="<?=get_template_directory_uri()?>/images/icons/comment-calendar.svg" alt="" class="comment-author__date-ico">
          <?php printf( '%1$s в %2$s', get_comment_date(),  get_comment_time()) ?>
        </span>
        <span class="comment-raiting"></span>
      </div>
 
      <?php if ($comment->comment_approved == '0') : ?>
        <p class="awaiting">Ваш комментарий ожидает модерации</p>
      <?php endif; ?>
 
      <div class="comment-text">
        <?php comment_text() ?>
      </div>
 
      <div class="reply">
        <?php comment_reply_link(array_merge( $args, array('depth' => $depth, 'max_depth' => $args['max_depth']))) ?>
      </div>
 
    </div>
<?php } ?>
 
<div id="comments" class="comments-area container">
	<div class="comment-forms">
	<?php
	$comments_args = [
		'fields' => [
			'author' => '<div class="comment-form-author">
				<input id="author" maxlength="60" class="comment-form__input" placeholder="Как к Вам обращаться?" name="author" type="text" value="' . esc_attr( $commenter['comment_author'] ) . '" size="30"' . $aria_req . $html_req . ' />
			</div>'
		],
		'comment_field' => '<div class="comment-form-comment">
			<textarea id="comment" class="comment-form__input comment-form__comment-input" placeholder="Комментарий" name="comment" cols="45" rows="8"  aria-required="true" required="required"></textarea>
		</div>',
		'comment_notes_before' => '',
		'comment_notes_after'  => '',
		'class_container'      => 'comment-respond',
		'class_form'           => 'comment-form',
		'class_submit'         => 'default-btn comment-form__submit',
		'name_submit'          => 'submit',
		'title_reply'          => __( 'Добавить комментарий' ),
		'title_reply_to'       => __( 'Ответ для %s' ) ,
		'title_reply_before'   => '<div id="reply-title" class="comment-reply-title">',
		'title_reply_after'    => '</div>',
		'cancel_reply_before'  => ' <small>',
		'cancel_reply_after'   => '</small>',
		'cancel_reply_link'    => __( ' Отменить ответ' ),
		'label_submit'         => __( 'Post Comment' ),
		'submit_button'        => '<input name="%1$s" type="submit" id="%2$s" class="%3$s" value="Оставить комментарий" />',
		'submit_field'         => '<div class="form-submit">%1$s %2$s</div>',
		'format'               => 'html5',
	];

	comment_form($comments_args);
	?>
				
	</div>
	
	<?php if ( have_comments() ) : ?>
	<h2>Комментарии</h2>
	<div class="comment-list">
		<?php
		wp_list_comments( array(
			'style'       => 'ol',
			'type'        => 'comment',
			'short_ping'  => true,
			'avatar_size' => 32,
			'callback'    => 'mytheme_comment',
		)
						);
		?>
	</div>

	<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : ?>
	<nav class="navigation comment-navigation" role="navigation">
		<h2 class="screen-reader-text section-heading"><?php _e( 'Comment navigation', '' ); ?></h2>
		<div class="nav-previous alignleft"><?php previous_comments_link( __( '&larr; Older Comments', '' ) ); ?></div>
		<div class="nav-next alignright"><?php next_comments_link( __( 'Newer Comments &rarr;', '' ) ); ?></div>
	</nav>
	<?php endif; ?>

	<?php if ( ! comments_open() && get_comments_number() ) : ?>
	<p class="no-comments"><?php _e( 'Комментарии закрыты.' , '' ); ?></p>
	<?php endif; ?>

	<?php endif; ?>
 
</div>