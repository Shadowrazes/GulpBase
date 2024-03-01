<?
//-----------------------------------------------------------------------------------------------
// Добавление поддержки превью-картинок
add_theme_support( 'post-thumbnails' );
//-----------------------------------------------------------------------------------------------
// Деактивация встроенного JQuery
add_filter( 'wp_enqueue_scripts', 'change_default_jquery', PHP_INT_MAX );
function change_default_jquery( ){
	wp_dequeue_script( 'jquery');
	wp_deregister_script( 'jquery');   
}
//-----------------------------------------------------------------------------------------------
// Приклеем функцию на добавление стилей в хедер
add_action('wp_print_styles', 'add_styles');
// Добавление стилей
function add_styles() {
    // Если мы в админке - ничего не делаем
	if(is_admin()) return false;
	
    wp_enqueue_style( 'normalize', 'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css' );
	wp_enqueue_style( 'uikit', 'https://cdn.jsdelivr.net/npm/uikit@3.16.24/dist/css/uikit.min.css' );
	wp_enqueue_style( 'style', get_template_directory_uri().'/style.css?1043' );
	wp_enqueue_style( 'custom', get_template_directory_uri().'/css/custom.css?1043');
}
//-----------------------------------------------------------------------------------------------
// Приклеем функцию на добавление скриптов в футер
add_action('wp_footer', 'add_scripts');
// Добавление скриптов
function add_scripts() {
	// Если мы в админке - ничего не делаем
	if(is_admin()) return false;
	
    // Свой JQuery
    wp_enqueue_script('jquery', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js','','',true);

	wp_enqueue_script('uikit', 'https://cdn.jsdelivr.net/npm/uikit@3.16.24/dist/js/uikit.min.js','','',true);
	wp_enqueue_script('uikit-icons', 'https://cdn.jsdelivr.net/npm/uikit@3.16.24/dist/js/uikit-icons.min.js','','',true);
	wp_enqueue_script('imask', 'https://cdnjs.cloudflare.com/ajax/libs/imask/7.1.3/imask.min.js','','',true);
	
	wp_enqueue_script('main-script', get_template_directory_uri().'/js/app.js?1043','','',true);
}
//-----------------------------------------------------------------------------------------------
add_action('init', 'add_jquery');
function add_jquery() {
	wp_enqueue_script( 'jquery' );
}    
//-----------------------------------------------------------------------------------------------
// Подключение main-script как модуля
add_filter('script_loader_tag', 'add_type_attribute' , 10, 3);
function add_type_attribute($tag, $handle, $src) {
    // if not your script, do nothing and return original $tag
    if ( 'main-script' !== $handle ) {
        return $tag;
    }
    // change the script tag by adding type="module" and return it.
    $tag = '<script type="module" src="' . esc_url( $src ) . '"></script>';
    return $tag;
}
//-----------------------------------------------------------------------------------------------
// Настройки краткого описания
add_filter( 'excerpt_length', function(){
	return 30;
} );
//-----------------------------------------------------------------------------------------------
add_filter( 'excerpt_more', function( $more ) {
	return '...';
} );
//-----------------------------------------------------------------------------------------------
// Добавление NOFOLLOW к NOINDEX (yoast)
add_filter( 'wpseo_robots_array', 'set_nofollow_for_pages' );
function set_nofollow_for_pages( $robots ) {
    if($robots['index'] == "noindex") {
    $robots['follow'] = 'nofollow';
  }
  
    return $robots;
}
//-----------------------------------------------------------------------------------------------
// Редактирование yoast breadcrumb
add_filter( 'wpseo_breadcrumb_links', 'breadcrumb_links_filter' );
function breadcrumb_links_filter( $crumbs ){
	foreach($crumbs as &$crumb){
		if($crumb['url'] == 'https://site.ru/category/blog'){
			$crumb = array('text' => 'Блог', 'url' => 'https://site.ru/blog', 'allow_html' => 1);
		}
	}

	return $crumbs;
}
//-----------------------------------------------------------------------------------------------
// Отправка формы
add_action( 'wp_ajax_sendForm', 'sendForm' );
add_action( 'wp_ajax_nopriv_sendForm', 'sendForm' );
function sendForm($attr) {
	$to = '-RECIEVER_EMAIL-, -RECIEVER_EMAIL-, -RECIEVER_EMAIL-';
	$subject = 'Новая заявка с сайта -SITE_NAME-';
	
	$message = '';
	$data = stripcslashes($_POST['data']);
	print_r(json_decode($data, true));
	foreach(json_decode($data, true) as $key => $field) {
		$message .= $key . ': ' . $field . '<br>';
	}
	
	$headers = array(
	'From: -SITE_NAME- <-SITE_SENDER_EMAIL->',
		'content-type: text/html',
	);
	
	wp_mail($to, $subject, $message, $headers);
	die();
}
//-----------------------------------------------------------------------------------------------
// Изменение порядка полей формы комментов
add_action( 'comment_form_fields', 'editCommentFormDir', 25 );
function editCommentFormDir( $comment_fields ) {
	// правила сортировки
	$order = array( 'author', 'email', 'comment' );
 
	// новый массив с изменённым порядком
	$new_fields = array();
 
	foreach( $order as $index ) {
		$new_fields[ $index ] = $comment_fields[ $index ];
	}
 
	return $new_fields;
 
}
//-----------------------------------------------------------------------------------------------
// Встроенный скрипт WP для формы комментов
add_action( 'wp_enqueue_scripts', 'enqueue_comment_reply' );
function enqueue_comment_reply() {
	if( is_singular() )
		wp_enqueue_script('comment-reply');
}
//-----------------------------------------------------------------------------------------------
// Шорткод блока с содержанием по заголовкам
add_shortcode( 'contents', 'contentsSection' );
function contentsSection( $atts ) {
	ob_start();
	?> 
	<ul class="post__contents" uk-accordion>
		<li class="post__contents-accordion">
			<a class="uk-accordion-title post__contents-title" href>Содержание</a>
			<aside class="uk-accordion-content post__contents-list">
				
			</aside>
		</li>
    </ul> 
	<?php
	return ob_get_clean();
}
//-----------------------------------------------------------------------------------------------
?>