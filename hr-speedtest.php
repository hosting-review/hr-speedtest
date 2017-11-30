<?php
/**
 * HR Page Speed
 *
 *
 * @package   HR Speed Test
 * @author    Juslintek
 * @license   GPL-3.0
 * @link      https://github.com/juslintek
 * @copyright 2017 Pangolin (Pty) Ltd
 *
 * @wordpress-plugin
 * Plugin Name:       HR Speed Test
 * Plugin URI:        https://hosting.review/webpage-speed-test/
 * Description:       React boilerplate for WordPress plugins
 * Version:           0.1.0
 * Author:            juslintek
 * Author URI:        https://github.com/juslintek
 * Text Domain:       hr-speedtest
 * License:           GPL-3.0
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.txt
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'HR_SPEEDTEST_VERSION', '0.1.0' );

function hr_speedtest_load_textdomain($locale = null) {
	global $l10n;
	$domain = 'hr-speedtest';

	if ( get_locale() == $locale ) {
		$locale = null;
	}

	if ( empty( $locale ) ) {
		if ( is_textdomain_loaded( $domain ) ) {
			return true;
		} else {
			return load_plugin_textdomain( $domain, false, $domain . '/languages' );
		}
	} else {
		$mo_orig = $l10n[$domain];
		unload_textdomain( $domain );

		$mofile = $domain . '-' . $locale . '.mo';
		$path = WP_PLUGIN_DIR . '/' . $domain . '/languages';

		if ( $loaded = load_textdomain( $domain, $path . '/'. $mofile ) ) {
			return $loaded;
		} else {
			$mofile = WP_LANG_DIR . '/plugins/' . $mofile;
			return load_textdomain( $domain, $mofile );
		}

		$l10n[$domain] = $mo_orig;
	}

	return false;
}

require_once( plugin_dir_path( __FILE__ ) . 'includes/class-wpr.php' );
require_once( plugin_dir_path( __FILE__ ) . 'includes/class-wpr-admin.php' );
require_once( plugin_dir_path( __FILE__ ) . 'includes/class-wpr-shortcode.php' );
require_once( plugin_dir_path( __FILE__ ) . 'includes/class-wpr-widget.php' );
require_once( plugin_dir_path( __FILE__ ) . 'includes/class-wpr-rest-controller.php' );



function hr_speedtest_activate() {

	global $wpdb;

	$table_name = $wpdb->prefix.'speed_tests';

	hr_speedtest_load_textdomain();

	if($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {

		$charset_collate = $wpdb->get_charset_collate();

		$create_table_query = "
            CREATE TABLE `{$table_name}` (
              `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
              `url` VARCHAR(2083) NOT NULL,
              `ip` INT UNSIGNED,
              `results` TEXT,
              `user_time_created` datetime,
              `user_time_zone` VARCHAR(64),
              `created` datetime,
              `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (id)
            ) ENGINE=InnoDB $charset_collate;";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

		try {
			dbDelta( $create_table_query );
		} catch (Exception $e) {
			wp_die("<pre>" . print_r($e, true) . "</pre>");
		}
	}
}
register_activation_hook( __FILE__, 'hr_speedtest_activate' );

add_action('init', function() {
	hr_speedtest_load_textdomain();
});

/**
 * Initialize Plugin
 *
 * @since 0.8.0
 */
function hr_speedtest_init() {
	$frontend_params_json = file_get_contents(plugin_dir_path( __FILE__ ) . 'build/asset-manifest.json');
	$frontend_params = json_decode($frontend_params_json);

	$wpr           = HRSpeedTest::get_instance();
	$wpr_shortcode = HRSpeedTest_Shortcode::get_instance($frontend_params);
	$wpr_admin = HRSpeedTest_Admin::get_instance();
	$wpr_rest  = HRSpeedTest_REST_Controller::get_instance();
}

add_action( 'plugins_loaded', 'hr_speedtest_init' );

/**
 * Register the widget
 *
 * @since 0.8.0
 */
function hr_speedtest_widget() {
	register_widget( 'HRP_Widget' );
}

add_action( 'widgets_init', 'hr_speedtest_widget' );

/**
 * Register activation and deactivation hooks
 */
register_activation_hook( __FILE__, array( 'HRSpeedTest', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'HRSpeedTest', 'deactivate' ) );

