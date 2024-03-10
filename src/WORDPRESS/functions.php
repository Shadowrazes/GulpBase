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
	
    wp_enqueue_style( 'uikit', get_template_directory_uri().'/static/uikit-3.16.24.min.css' );
	wp_enqueue_style( 'style', get_template_directory_uri().'/style.css?1044' );
	wp_enqueue_style( 'custom', get_template_directory_uri().'/css/custom.css?1044');
}
//-----------------------------------------------------------------------------------------------
// Приклеем функцию на добавление скриптов в футер
add_action('wp_footer', 'add_scripts');
// Добавление скриптов
function add_scripts() {
	// Если мы в админке - ничего не делаем
	if(is_admin()) return false;
	
    // Свой JQuery
    wp_enqueue_script('jquery', get_template_directory_uri().'/static/jquery.min.js','','',true);

	wp_enqueue_script('uikit', get_template_directory_uri().'/static/uikit-3.16.24.min.js','','',true);
	wp_enqueue_script('uikit-icons', get_template_directory_uri().'/static/uikit-icons-3.16.24.min.js','','',true);
	wp_enqueue_script('imask', get_template_directory_uri().'/static/imask-7.5.0.min.js','','',true);
	
	wp_enqueue_script('main-script', get_template_directory_uri().'/js/app.js?1044','','',true);
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
// Разрешение на добавление SVG в медиафайлы
add_filter( 'upload_mimes', 'svg_upload_allow' );
function svg_upload_allow( $mimes ) {
	$mimes['svg']  = 'image/svg+xml';

	return $mimes;
}
//-----------------------------------------------------------------------------------------------
// Подмена mime типа SVG
add_filter( 'wp_check_filetype_and_ext', 'fix_svg_mime_type', 10, 5 );
function fix_svg_mime_type( $data, $file, $filename, $mimes, $real_mime = '' ){

	// WP 5.1 +
	if( version_compare( $GLOBALS['wp_version'], '5.1.0', '>=' ) ){
		$dosvg = in_array( $real_mime, [ 'image/svg', 'image/svg+xml' ] );
	}
	else {
		$dosvg = ( '.svg' === strtolower( substr( $filename, -4 ) ) );
	}

	// mime тип был обнулен, поправим его
	// а также проверим право пользователя
	if( $dosvg ){

		// разрешим
		if( current_user_can('manage_options') ){

			$data['ext']  = 'svg';
			$data['type'] = 'image/svg+xml';
		}
		// запретим
		else {
			$data['ext']  = false;
			$data['type'] = false;
		}

	}

	return $data;
}
//-----------------------------------------------------------------------------------------------
// Отображение SVG в медиафайлах
add_filter( 'wp_prepare_attachment_for_js', 'show_svg_in_media_library' );
function show_svg_in_media_library( $response ) {

	if ( $response['mime'] === 'image/svg+xml' ) {

		// С выводом названия файла
		$response['image'] = [
			'src' => $response['url'],
		];
	}

	return $response;
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