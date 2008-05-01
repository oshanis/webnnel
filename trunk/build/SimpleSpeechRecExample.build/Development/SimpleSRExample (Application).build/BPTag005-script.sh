#!/bin/tcsh
pbxbuild installsrc SRCROOT=$DSTROOT/$INSTALL_PATH/Sources
/bin/rm -rf $DSTROOT/$INSTALL_PATH/Sources/build/
/bin/rm -rf $DSTROOT/$INSTALL_PATH/Sources/CVS/
/bin/rm -rf $DSTROOT/$INSTALL_PATH/Sources/SimeSpeechRecExample.pbproj/CVS/
/usr/sbin/chown root:wheel $DSTROOT/$INSTALL_PATH/Sources/*

