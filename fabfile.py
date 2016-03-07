# fab test deploy
# fab prod deploy
# fab prod1 deploy
# fab prod2 deploy
# fab prod mt
from fabric.api import *
from fabric.contrib.files import exists

root_path = '/home/jacky007wang/webapps/'
django_folder = 'xingzhe_web'

def prod():
    env.django_project = 'xingzhe'
    env.settings_debug = 'False'
    # env.settings_static_root = root_path + 'xingzhe_static/'
    # env.settings_media_root = root_path + 'xingzhe_media/'
    # env.settings_db = 'PROD_DATABASES'
    env.settings = 'settings_prod'
    common()

def prod1():
    env.django_project = 'xingzhe'
    env.settings_debug = 'False'
    env.settings = 'settings_prod'
    common1()

def common1():
    env.hosts = ['xingzhe-server']
    env.port = 2233
    env.user = 'jacky007wang'
    env.app_path = root_path + env.django_project + '/'
    env.django_path = env.app_path + django_folder + '/'
    env.settings_path = env.django_path + 'xingzhe/'

def prod2():
    env.django_project = 'xingzhe'
    env.settings_debug = 'False'
    env.settings = 'settings_prod'
    common2()

def common2():
    env.hosts = ['jacky007wang@xingzhe-ssd:2233']
    env.port = 2233
    env.user = 'jacky007wang'
    env.app_path = root_path + env.django_project + '/'
    env.django_path = env.app_path + django_folder + '/'
    env.settings_path = env.django_path + 'xingzhe/'


def common():
    env.hosts = ['jacky007wang@node:2233']
    env.app_path = root_path + env.django_project + '/'
    env.django_path = env.app_path + django_folder + '/'
    env.settings_path = env.django_path + 'xingzhe/'

def deploy_mt():
    with cd(env.django_path):
        run('git branch -D deploy')
        run('git fetch origin mt:deploy')
        run('git reset HEAD^^^^^')
        run('git checkout -f')
        run('git clean -df')
        run('git rebase deploy')

    with cd(env.settings_path):
        run("sed -i -e 's/^DEBUG = .*/DEBUG = %s/' settings.py" % env.settings_debug)
        run("sed -i -e 's/^from settings_local import/from %s import/' settings.py" % env.settings)

    with cd(env.django_path):
        run('python manage.py collectstatic --noinput')

    with cd(env.app_path):
        run('supervisorctl restart xingzhe')

def get_recent_trail():
    with cd(env.django_path):
        run('python docs/get_recent_trail.py > static/js/recent.json')


def deploy():
    with cd(env.django_path):
        run('git branch -D deploy')
        run('git fetch origin huanxin_v2_post:deploy')
        run('git reset HEAD^^^^^')
        run('git checkout -f')
        run('git clean -df')
        run('git rebase deploy')

    with cd(env.settings_path):
        run("sed -i -e 's/^DEBUG = .*/DEBUG = %s/' settings.py" % env.settings_debug)
        run("sed -i -e 's/^from settings_local import/from %s import/' settings.py" % env.settings)
        # run("sed -i -e 's/^DATABASES = .*/DATABASES = %s/' settings.py" % env.settings_db)
        # run('sed -i -e "s@^STATIC_ROOT = .*@STATIC_ROOT = \'%s\'@" settings.py' % env.settings_static_root)
        # run('sed -i -e "s@^MEDIA_ROOT = .*@MEDIA_ROOT = \'%s\'@" settings.py' % env.settings_media_root)

    with cd(env.django_path):
        run('python manage.py collectstatic --noinput')

    with cd(env.app_path):
        #run('supervisorctl stop xingzhe')
        run('find . -name "*.pyc"  | xargs rm -f')
        run('supervisorctl restart xingzhe')
        run('supervisorctl restart rq')





def common_test():
    root_path = '/mnt/devtest/webapps/'
    django_folder = 'xingzhe_web'
    env.hosts = ['xztestd']
    env.port = 22
    env.user = 'devtest'
    env.app_path = root_path + env.django_project + '/'
    env.django_path = env.app_path + django_folder + '/'
    env.settings_path = env.django_path + 'xingzhe/'

def test():
    env.django_project= 'xingzhe'
    env.settings_debug = 'True'
    env.settings = 'settings_test'
    common_test()


def deploy_test():
    django_test_path = '/mnt/devtest/webapps/xingzhe/xingzhe_web'
    with settings(warn_only=True):
        if run("test -d %s" % django_test_path).failed:
            run('git clone git@coding.net:bi-ci/xingzhe_server.git %s' % django_test_path)

    with cd(env.django_path):
        run('git branch -D deploy')
        run('git fetch origin master:deploy')
        run('git reset HEAD^^^^^')
        run('git checkout -f')
        run('sudo git clean -df')
        run('git rebase deploy')
    with cd(env.settings_path):
        run("sed -i -e 's/^DEBUG = .*/DEBUG = %s/' settings.py" % env.settings_debug)
        run("sed -i -e 's/^from settings_local import/from %s import/' settings.py" % env.settings)

    with cd(env.django_path):
        run('sudo python manage.py collectstatic --noinput')

    with cd(env.app_path):
        run('sudo service supervisord restart')


@hosts(['121.40.74.59'])
def branch_test(branch_name='db_reconstruct', port=9000):
    env.django_project= 'xingzhe'
    env.settings_debug = 'True'
    env.settings = 'settings_%s' %branch_name
    root_path = '/mnt/devtest/webapps/'
    django_folder =  branch_name 
    env.hosts = ['121.40.74.59']
    env.port = 22
    env.user = 'root'
    env.app_path = root_path + env.django_project + '/'
    env.django_path = env.app_path + django_folder
    env.settings_path = env.django_path + '/xingzhe/'
    print 'env.django_path:', env.django_path, 'env.app_path:', env.app_path 
    print 'env.hosts:', env.hosts 
    with settings(warn_only=True):
        if run("test -d %s" % env.django_path).failed:
            run('git clone git@coding.net:bi-ci/xingzhe_server.git %s' % env.django_path)
    with cd(env.django_path):
        run('git reset --hard')
        run('git checkout %s' % branch_name)
        run('git pull origin %s' % branch_name)
    with cd(env.settings_path):
        run("sed -i -e 's/^DEBUG = .*/DEBUG = %s/' settings.py" % env.settings_debug)
        run("sed -i -e 's/^from settings_local import/from %s import/' settings.py" % env.settings)
    with cd(env.django_path):
        run('python manage.py collectstatic --noinput')
    with cd(env.app_path):
        run('stop_test')
        run('start_test >& /dev/null', pty=False)

def dev(branch_name, port=9000):
    env.django_project= 'xingzhe' 
    env.settings_debug = 'True'
    env.settings = 'settings_db_reconstruct'
    root_path = '/mnt/devtest/webapps/'
    django_folder =  "db_reconstruct" 
    env.hosts = ['121.40.74.59']
    env.port = 22
    env.user = 'root'
    env.app_path = root_path + env.django_project + '/'
    env.django_path = env.app_path + django_folder
    env.settings_path = env.django_path + '/xingzhe/'
    print 'env.django_path:', env.django_path, 'env.app_path:', env.app_path 
    print 'env.hosts:', env.hosts 
    with settings(warn_only=True):
        if run("test -d %s" % env.django_path).failed:
            run('git clone git@coding.net:bi-ci/xingzhe_server.git %s' % env.django_path)
    with cd(env.django_path):
        run('git reset --hard')
        run('git checkout %s' % branch_name)
        run('git pull origin %s' % branch_name)
    with cd(env.settings_path):
        run("sed -i -e 's/^DEBUG = .*/DEBUG = %s/' settings.py" % env.settings_debug)
        run("sed -i -e 's/^from settings_local import/from %s import/' settings.py" % env.settings)
    with cd(env.django_path):
        run('python manage.py collectstatic --noinput')
    with cd(env.app_path):
        run('stop_test')
        run('start_test >& /dev/null', pty=False)
        run('supervisorctl restart rq')



def xingzhe_test(branch_name='db_reconstruct', port=9000):
    env.django_project= 'xingzhe' 
    env.settings_debug = 'True'
    env.settings = 'settings_xingzhe_test'
    root_path = '/home/jacky007wang/webapps/'
    django_folder = 'xingzhe_test' 
    env.hosts = ['42.120.21.143']
    env.port = 2233
    env.user = 'jacky007wang'
    env.app_path = root_path + env.django_project + '/'
    env.django_path = env.app_path + django_folder
    env.settings_path = env.django_path + '/xingzhe/'
    print 'env.django_path:', env.django_path, 'env.app_path:', env.app_path 
    print 'env.hosts:', env.hosts 
    with settings(warn_only=True):
        if run("test -d %s" % env.django_path).failed:
            run('git clone git@coding.net:bi-ci/xingzhe_server.git %s' % env.django_path)
    with cd(env.django_path):
        run('git reset --hard')
        run('git pull origin %s' % branch_name)
    with cd(env.settings_path):
        run("sed -i -e 's/^DEBUG = .*/DEBUG = %s/' settings.py" % env.settings_debug)
        run("sed -i -e 's/^from settings_local import/from %s import/' settings.py" % env.settings)
    with cd(env.django_path):
        run('python manage.py collectstatic --noinput')

@hosts(['121.40.74.59'])
def lushu_branch(branch_name='lushu', port=8000):
    env.django_project= 'xingzhe'
    env.settings_debug = 'True'
    env.settings = 'settings_%s' %branch_name
    root_path = '/mnt/devtest/webapps/'
    django_folder =  "lushu"
    # env.hosts = ['121.40.74.59']
    env.port = 22
    env.user = 'root'
    # /mnt/devtest/webapps/xingzhe/
    env.app_path = root_path + env.django_project + '/'

    # /mnt/devtest/webapps/xingzhe/lushu
    env.django_path = env.app_path + django_folder

    # /mnt/devtest/webapps/xingzhe/lushu/xingzhe/
    env.settings_path = env.django_path + '/xingzhe/'

    # print 'env.django_path:', env.django_path, 'env.app_path:', env.app_path
    # print 'env.hosts:', env.hosts

    with settings(warn_only=True):
        if run("test -d %s" % env.django_path).failed:
            run('git clone git@coding.net:bi-ci/xingzhe_server.git %s' % env.django_path)
    with cd(env.django_path):
        run('git reset --hard')
        run('git checkout %s' % branch_name)
        run('git pull origin %s' % branch_name)
    with cd(env.settings_path):
        run("sed -i -e 's/^DEBUG = .*/DEBUG = %s/' settings.py" % env.settings_debug)
        run("sed -i -e 's/^from settings_local import/from %s import/' settings.py" % 'settings_db_reconstruct')
    with cd(env.django_path):
        run('python manage.py collectstatic --noinput')
    # with cd(env.app_path):
    #     run('stop_test')
        # /usr/bin/start_test_lushu
        # run('start_test_lushu >& /dev/null', pty=False)
        # run('supervisorctl restart rq')



@hosts(['121.40.74.59'])
def activity_branch(branch_name='activity', port=7777):
    env.django_project= 'xingzhe'
    env.settings_debug = 'True'
    env.settings = 'settings_db_reconstruct'
    root_path = '/mnt/devtest/webapps/'
    django_folder =  branch_name
    env.hosts = '121.40.74.59'
    env.port = 22
    env.user = 'root'

    nginx_setting = '/etc/nginx/sites-enabled/'
    # /mnt/devtest/webapps/xingzhe/
    env.app_path = root_path + env.django_project + '/'

    # /mnt/devtest/webapps/xingzhe/<branch_name>

    env.django_path = env.app_path + django_folder

    # /mnt/devtest/webapps/xingzhe/<branch_name>/xingzhe/
    env.settings_path = env.django_path + '/xingzhe/'

    # print 'env.django_path:', env.django_path, 'env.app_path:', env.app_path
    # print 'env.hosts:', env.hosts

    with settings(warn_only=True):
        if run("test -d %s" % env.django_path).failed:
            run('cd %s' % env.app_path)
            # run('mkdir %s' % branch_name)
            with cd(env.app_path):
                run('git clone git@coding.net:bi-ci/xingzhe_server.git %s' % branch_name)

    with cd(env.django_path):
        run('git reset --hard')
        run('git checkout %s' % branch_name)
        run('git pull origin %s' % branch_name)
    with cd(env.settings_path):
        run("sed -i -e 's/^DEBUG = .*/DEBUG = %s/' settings.py" % env.settings_debug)
        run("sed -i -e 's/^from settings_local import/from %s import/' settings.py" % env.settings)
    with cd(env.django_path):
        run('python manage.py collectstatic --noinput')
    with cd(nginx_setting):
        if exists(branch_name):
            pass
        else:
            run("cp test1.imxingzhe.com %s" %branch_name)
            run("sed -i '3s/80/82/' %s" %branch_name)
            run("sed -i '13s/9000/%s/' %s" %(port, branch_name))
            run("/etc/init.d/nginx reload")
    with cd(env.app_path):
        run('stop_test')
        # /usr/bin/start_test_lushu
        run('nohup python manage.py runserver 0.0.0.0:%s' %port)
        # run('start_test_activity >& /dev/null', pty=False)
        # run('supervisorctl restart rq')



@hosts(['121.40.74.59'])
def huanxin_v2_branch(branch_name='huanxin_v2', port=8000):
    env.django_project= 'xingzhe'
    env.settings_debug = 'True'
    env.settings = 'settings_db_reconstruct'
    root_path = '/mnt/devtest/webapps/'
    django_folder =  'huanxin_v2'
    # env.hosts = ['121.40.74.59']
    env.port = 22
    env.user = 'root'
    # /mnt/devtest/webapps/xingzhe/
    env.app_path = root_path + env.django_project + '/'

    # /mnt/devtest/webapps/xingzhe/huanxin_v2
    env.django_path = env.app_path + django_folder

    # /mnt/devtest/webapps/xingzhe/huanxin_v2/xingzhe/
    env.settings_path = env.django_path + '/xingzhe/'

    # print 'env.django_path:', env.django_path, 'env.app_path:', env.app_path
    # print 'env.hosts:', env.hosts

    with settings(warn_only=True):
        if run("test -d %s" % env.django_path).failed:
            run('git clone git@git.coding.net:bi-ci/xingzhe_server.git %s' % env.django_path)
    with cd(env.django_path):
        run('git reset --hard')
        run('git checkout %s' % branch_name)
        run('git pull origin %s' % branch_name)
    with cd(env.settings_path):
        run("sed -i -e 's/^DEBUG = .*/DEBUG = %s/' settings.py" % env.settings_debug)
        run("sed -i -e 's/^from settings_local import/from %s import/' settings.py" % 'settings_db_reconstruct')
    with cd(env.django_path):
        run('python manage.py collectstatic --noinput')
    # with cd(env.app_path):
    #     run('stop_test')
        # /usr/bin/start_test_lushu
        # run('start_test_lushu >& /dev/null', pty=False)
        # run('supervisorctl restart rq')
